from flask import Flask, jsonify
import pandas as pd
import requests

app = Flask(__name__)

@app.route("/api/collisions")
def get_collisions():
  # Fetch and process data (same as before)
  url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json?$where=crash_date between '2024-09-01T00:00:00' and '2024-09-30T23:59:59'"

  response = requests.get(url)

  columns_to_use = ["crash_date", "crash_time", "collision_id", "borough", "zip_code", "latitude", "longitude", "location", 
                                                     "on_street_name", "cross_street_name", "off_street_name", "number_of_persons_killed", 
                                                     "number_of_persons_injured", "contributing_factor_vehicle_1"]

  collisions_data = pd.DataFrame(response.json(), columns=columns_to_use)
                                 
  dtypes={
    'collision_id' : 'int64',
    'borough' : 'string',
    'zip_code' : 'string',
    'latitude' : 'float64', 
    'longitude' : 'float64',
    'location' : 'string',
    'on_street_name' : 'string',
    'cross_street_name' : 'string',
    'off_street_name' : 'string',
    'number_of_persons_injured' : 'float64',
    'number_of_persons_killed' : 'float64',
    'contributing_factor_vehicle_1' : 'string'
  }

  collisions_data = collisions_data.astype(dtypes)
  
  collisions_data['crash_date'] = pd.to_datetime(collisions_data['crash_date'])
  collisions_data['crash_time'] = pd.to_datetime(collisions_data['crash_time'], format='%H:%M').dt.hour

  # coordinates for area within NYC
  nyc_lat_min, nyc_lat_max = 40.4774, 40.9176
  nyc_lon_min, nyc_lon_max = -74.2591, -73.7004

  # X and y dataset
  Xandy = collisions_data[['latitude', 'longitude', 'number_of_persons_injured', 'number_of_persons_killed']]
  Xandy = Xandy.dropna()
  #remove latitude and longitude that contains 0
  Xandy = Xandy[~((Xandy['latitude'] == 0.000000) & (Xandy['longitude'] == 0.000000))]
  #remove latitude and longitude not contained in NYC area
  Xandy = Xandy[(Xandy['latitude'] >= nyc_lat_min) & (Xandy['latitude'] <= nyc_lat_max) &
          (Xandy['longitude'] >= nyc_lon_min) & (Xandy['longitude'] <= nyc_lon_max)]
  Xandy["number_of_crashes"] = 1
  Xandy = Xandy.groupby(['latitude', 'longitude']).sum().reset_index()
    
  # Convert to JSON and return
  return jsonify(Xandy.to_dict(orient='records'))

if __name__ == '__main__':
  app.run(debug=True) 

# [
#   {
#     "borough": "BROOKLYN",
#     "collision_id": "4456314",
#     "contributing_factor_vehicle_1": "Unspecified",
#     "contributing_factor_vehicle_2": null,
#     "contributing_factor_vehicle_3": null,
#     "contributing_factor_vehicle_4": null,
#     "contributing_factor_vehicle_5": null,
#     "crash_date": "2021-09-11",
#     "crash_time": "9:35",
#     "cross_street_name": "1211      LORING AVENUE",
#     "latitude": "40.667202",
#     "location": {
#       "human_address": "{\"address\": \"\", \"city\": \"\", \"state\": \"\", \"zip\": \"\"}",
#       "latitude": "40.667202",
#       "longitude": "-73.8665"
#     },
#     "longitude": "-73.8665",
#     "number_of_cyclist_injured": "0",
#     "number_of_cyclist_killed": "0",
#     "number_of_motorist_injured": "0",
#     "number_of_motorist_killed": "0",
#     "number_of_pedestrians_injured": "0",
#     "number_of_pedestrians_killed": "0",
#     "number_of_persons_injured": "0",
#     "number_of_persons_killed": "0",
#     "off_street_name": null,
#     "on_street_name": null,
#     "vehicle_type_code1": "Sedan",
#     "vehicle_type_code2": null,
#     "vehicle_type_code_3": null,
#     "vehicle_type_code_4": null,
#     "vehicle_type_code_5": null,
#     "zip_code": "11208"
#   },