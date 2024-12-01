from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_cors import CORS
from scipy.spatial import distance
import pandas as pd
import requests
import calendar
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app) #allow frontend to communicate with backend

cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache', 'CACHE_DEFAULT_TIMEOUT': 300})  #5 minute timeout

#filter necessary rows out of the dataset and insert appropriate datatypes
def filterData(all_data):
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
  nyc_lat_min, nyc_lat_max = 40.498947, 40.912884
  nyc_lon_min, nyc_lon_max = -74.25496, -73.70055
  #remove latitude and longitude that contains 0
  collisions_data = collisions_data[~((collisions_data['latitude'] == 0.000000) & (collisions_data['longitude'] == 0.000000))]
  #remove latitude and longitude not contained in NYC area
  collisions_data = collisions_data[(collisions_data['latitude'] >= nyc_lat_min) & (collisions_data['latitude'] <= nyc_lat_max) &
        (collisions_data['longitude'] >= nyc_lon_min) & (collisions_data['longitude'] <= nyc_lon_max)]
  return collisions_data

#function to get previous month
def get_previous_month_dates():
    today = datetime.today()
    first_day_of_current_month = today.replace(day=5) #5th day of month (due to how the dataset is updated)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=5) #subtract 5 days to get last day of prev month
    first_day_of_previous_month = last_day_of_previous_month.replace(day=1) #first day of prev month
    return first_day_of_previous_month.strftime('%Y-%m-%d'), last_day_of_previous_month.strftime('%Y-%m-%d')

@app.route("/api/collisions", methods=['POST'])
# @cache.cached(timeout=3600) #Cache route for 3600s = 1 hour; If this function gets called again, it will refer to the cache in the next hour
def get_collisions():
  data = request.get_json()
  def get_last_day_of_month(month, year):
     _, last_day = calendar.monthrange(year, month)
     return last_day
  month = int(data.get('month'))
  year = int(data.get('year'))
  last_day_of_month = get_last_day_of_month(month, year)
  monthString = str(month).zfill(2)
  yearString = str(year)
  start_date, end_date = get_previous_month_dates()
  base_url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json"  #API
  # parameters for selecting data for the previous month only
  params = {
    "$where": f"crash_date between '{yearString}-{monthString}-01T00:00:00' and '{yearString}-{monthString}-{last_day_of_month}T23:59:59'",
    "$limit": 5000,
    "$offset": 0
  }
  all_data = []
  # while there is more data to retrieve
  while True:
    response = requests.get(base_url, params=params)  #get data from a specific month
    data = response.json()
    
    if not data:
        break  # Exit loop if no more data
    
    all_data.extend(data)
    params["$offset"] += 5000  # Move to the next batch

  collisions_data = filterData(all_data)
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
  base_url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json"  #API
  all_data = []
  # get the data from the form
  data = request.get_json()
  latitude = float(data.get('latitude'))
  longitude = float(data.get('longitude'))
  # parameters for selecting the row with the user's lat and long
  params = {
    "$where": f"latitude = {latitude} AND longitude = {longitude}",  # Filter by specific coordinates
    "$limit": 5000,
    "$offset": 0
  }
  # while there is more data to retrieve
  while True:
    response = requests.get(base_url, params=params)  #get data from a specific month
    data = response.json()
    
    if not data:
        break  # Exit loop if no more data
    
    all_data.extend(data)
    params["$offset"] += 5000  # Move to the next batch

  collisions_data = filterData(all_data)
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
  records = Xandy.to_dict(orient='records')
  if records:
     return jsonify(records[0])
  else:
     return {}

@app.route("/nearest", methods=['POST'])
def predict_nearest():
  data = request.get_json()
  latitude = float(data.get('latitude'))
  longitude = float(data.get('longitude'))
  base_url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json"  #API
  all_data = []
  interval = 0.01
  lowLat, highLat, lowLong, highLong = latitude, latitude, longitude, longitude
  # find all locations within a certain range for latitude & longitude within the input location. Starts with the range of 0.01 below and above the current lat and long
  while len(all_data) == 0: # while there is no data found yet
    lowLat = lowLat - interval if (lowLat - interval) > 40.498947 else lowLat # make sure lower bounds of lat doesn't dip lower than within NYC
    highLat = highLat + interval if (highLat + interval) < 40.912884 else highLat  # make sure higher bounds of lat doesn't hit higher than within NYC
    lowLong = lowLong - interval if (lowLong - interval) > -74.25496 else lowLong # make sure lower bounds of long doesn't dip lower than within NYC
    highLong = highLong + interval if (highLong + interval) < -73.70055 else highLong # make sure higher bounds of long doesn't hit higher than within NYC
    params = {
        "$where": f"latitude between {lowLat} and {highLat} AND "
                  f"longitude between {lowLong} and {highLong}",  # Filter by specific coordinates
        "$limit": 5000,
        "$offset": 0
    }

    while True:
        response = requests.get(base_url, params)  #get data from a specific month
        data = response.json()
        
        if not data:
            break  # Exit loop if no more data
        
        all_data.extend(data)
        params["$offset"] += 5000  # Move to the next batch
        
    interval = 0.03 # increment the interval to 0.03 if can't find anything on the first run

  # filter all the data
  collisions_data = filterData(all_data)
  #target location from the user
  target_location = (latitude, longitude)
  # algorithm to determine distances between all locations from the target location
  collisions_data['distance'] = collisions_data.apply(
      lambda row: distance.euclidean((row['latitude'], row['longitude']), target_location), axis=1
  )
  # find the minimum distance in the table
  nearest_point = collisions_data.loc[collisions_data['distance'].idxmin()]
  latitude = nearest_point['latitude']
  longitude = nearest_point['longitude']
  all_data = []
  params = {
    "$where": f"latitude = {latitude} AND longitude = {longitude}",  # Filter by specific coordinates
    "$limit": 5000,
    "$offset": 0
  }
  while True:
    response = requests.get(base_url, params=params)  #get data from a specific month
    data = response.json()
    
    if not data:
        break  # Exit loop if no more data
    
    all_data.extend(data)
    params["$offset"] += 5000  # Move to the next batch
  
  collisions_data = filterData(all_data)
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
  records = Xandy.to_dict(orient='records')
  if records:
     return jsonify(records[0])
  else:
     return {}

if __name__ == '__main__':
  app.run(debug=True)  
