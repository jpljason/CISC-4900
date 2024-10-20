from flask import Flask, request, jsonify
from flask_caching import Cache
import pandas as pd
import requests

app = Flask(__name__)

cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})  #5 minute timeout

def getDataAndFilter(params):
  base_url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json"  #API

  all_data = []
  # while there is more data to retrieve
  while True:
    response = requests.get(base_url, params=params)  #get data from a specific month
    data = response.json()
    
    if not data:
        break  # Exit loop if no more data
    
    all_data.extend(data)
    params["$offset"] += 5000  # Move to the next batch

  columns_to_use = ["crash_date", "crash_time", "collision_id", "borough", "zip_code", "latitude", "longitude", "location", 
                                                     "on_street_name", "cross_street_name", "off_street_name", "number_of_persons_killed", 
                                                     "number_of_persons_injured", "contributing_factor_vehicle_1"]

  collisions_data = pd.DataFrame(all_data, columns=columns_to_use)
                                 
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
  #coordinates for area within NYC
  nyc_lat_min, nyc_lat_max = 40.4774, 40.9176
  nyc_lon_min, nyc_lon_max = -74.2591, -73.7004
  #remove latitude and longitude that contains 0
  collisions_data = collisions_data[~((collisions_data['latitude'] == 0.000000) & (collisions_data['longitude'] == 0.000000))]
  #remove latitude and longitude not contained in NYC area
  collisions_data = collisions_data[(collisions_data['latitude'] >= nyc_lat_min) & (collisions_data['latitude'] <= nyc_lat_max) &
        (collisions_data['longitude'] >= nyc_lon_min) & (collisions_data['longitude'] <= nyc_lon_max)]
  return collisions_data

@app.route("/api/collisions")
@cache.cached(timeout=3600) #Cache route for 3600s = 1 hour; If this function gets called again, it will refer to the cache in the next hour
def get_collisions():
  params = {
    "$where": "crash_date between '2024-09-01T00:00:00' and '2024-09-30T23:59:59'",
    "$limit": 5000,
    "$offset": 0
  }
  collisions_data = getDataAndFilter(params)
  # Dataset for the details of latitudes and longitudes including borough, zip code, street names
  addresses = collisions_data[['latitude', 'longitude', 'borough', 'zip_code', 'on_street_name', 'cross_street_name', 'off_street_name']]
  addresses = addresses.drop_duplicates(subset=['latitude', 'longitude'])

  # X and y dataset
  Xandy = collisions_data[['latitude', 'longitude', 'number_of_persons_injured', 'number_of_persons_killed']]
  Xandy = Xandy.dropna()
  Xandy["number_of_crashes"] = 1
  Xandy = Xandy.groupby(['latitude', 'longitude']).sum().reset_index()
  # Merge injured and killed and address details table together
  Xandy = pd.merge(addresses, Xandy, on=['latitude', 'longitude'], how='left')
  # Convert to JSON and return
  return jsonify(Xandy.to_dict(orient='records'))
  
@app.route("/submit", methods=['POST'])
def predict():
  data = request.get_json()
  latitude = data.get('latitude')
  longitude = data.get('longitude')
  params = {
    "$where": f"latitude = {latitude} AND longitude = {longitude}",  # Filter by specific coordinates
    "$limit": 5000,
    "$offset": 0
  }
  collisions_data = getDataAndFilter(params)
  # Dataset for the details of latitudes and longitudes including borough, zip code, street names
  addresses = collisions_data[['latitude', 'longitude', 'borough', 'zip_code', 'on_street_name', 'cross_street_name', 'off_street_name']]
  addresses = addresses.drop_duplicates(subset=['latitude', 'longitude'])

  # X and y dataset
  Xandy = collisions_data[['latitude', 'longitude', 'number_of_persons_injured', 'number_of_persons_killed']]
  Xandy = Xandy.dropna()
  Xandy["number_of_crashes"] = 1
  #function for determining whether the crash has a injury
  def calculate_injuries(row):
      if(row['number_of_persons_injured'] > 0):
          return 1
      else:
          return 0
  #function for determining whether the crash has a kill
  def calculate_killed(row):
      if(row['number_of_persons_killed'] > 0):
          return 1
      else:
          return 0
  Xandy["crashes_with_injuries"] = Xandy.apply(calculate_injuries, axis=1)
  Xandy["crashes_with_kills"] = Xandy.apply(calculate_killed, axis=1)
  Xandy = Xandy.groupby(['latitude', 'longitude']).sum().reset_index()
  # Merge injured and killed and address details table together
  Xandy = pd.merge(addresses, Xandy, on=['latitude', 'longitude'], how='left')
  # Convert to JSON and return
  return jsonify(Xandy.to_dict(orient='records'))

if __name__ == '__main__':
  app.run(debug=True) 
