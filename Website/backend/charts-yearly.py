import pandas as pd
import requests
from datetime import datetime, time   #this "time" is for rush hour
import time as Time
import json
import os

# function to fetch data from the API based on different parameters and filter that data 
def get_and_filter_data(params):
  url = "https://data.cityofnewyork.us/resource/h9gi-nx95.json"
  all_data = []
  while True:
    response = requests.get(url, params)
    data = response.json()

    if not data:
        break
    
    all_data.extend(data)
    params["$offset"] += 5000

  columns_to_use = ["crash_date", "crash_time", "collision_id", "borough", "zip_code", "latitude", "longitude", "on_street_name", "cross_street_name", "off_street_name", "number_of_persons_killed", 
  "number_of_persons_injured", 'number_of_pedestrians_injured', 'number_of_pedestrians_killed', 'number_of_cyclist_injured', 'number_of_cyclist_killed', 'number_of_motorist_injured',
  'number_of_motorist_killed', "contributing_factor_vehicle_1", "contributing_factor_vehicle_2", "vehicle_type_code1", "vehicle_type_code2"]

  collisions_data = pd.DataFrame(all_data, columns=columns_to_use)

  dtypes={
  'collision_id' : 'int64',
  'borough' : 'string',
  'zip_code' : 'string',
  'latitude' : 'float64', 
  'longitude' : 'float64',
  'on_street_name' : 'string',
  'cross_street_name' : 'string',
  'off_street_name' : 'string',
  'number_of_persons_injured' : 'float64',
  'number_of_persons_killed' : 'float64',
  'number_of_pedestrians_injured' : 'float64',
  'number_of_pedestrians_killed' : 'float64',
  'number_of_cyclist_injured' : 'float64',
  'number_of_cyclist_killed' : 'float64',
  'number_of_motorist_injured' : 'float64',
  'number_of_motorist_killed' : 'float64',
  'contributing_factor_vehicle_1' : 'string',
  'contributing_factor_vehicle_2' : 'string',
  'vehicle_type_code1' : 'string',
  'vehicle_type_code2' : 'string'
  }

  collisions_data = collisions_data.astype(dtypes)
  collisions_data['crash_date'] = pd.to_datetime(collisions_data['crash_date'])
  collisions_data['crash_time'] = pd.to_datetime(collisions_data['crash_time'], format='%H:%M').dt.time
  #coordinates for area within NYC
  nyc_lat_min, nyc_lat_max = 40.498947, 40.912884
  nyc_lon_min, nyc_lon_max = -74.25496, -73.70055
  #remove latitude and longitude that contains 0
  collisions_data = collisions_data[~((collisions_data['latitude'] == 0.000000) & (collisions_data['longitude'] == 0.000000))]
  #remove latitude and longitude not contained in NYC area
  collisions_data = collisions_data[(collisions_data['latitude'] >= nyc_lat_min) & (collisions_data['latitude'] <= nyc_lat_max) &
        (collisions_data['longitude'] >= nyc_lon_min) & (collisions_data['longitude'] <= nyc_lon_max)]
  
  return collisions_data

def add_data_to_json():
  current_month = datetime.now().month
  current_day = datetime.now().day
  current_year = datetime.now().year
  previous_year = current_year-1
  oldest_year = previous_year-10
  # params for the previous year (newest year in the data)
  params = {
    "$where": f"crash_date between '{previous_year}-01-01T00:00:00' and '{previous_year}-12-31T23:59:59'",
    "$limit": 5000,
    "$offset" : 0
  }
  # params for the oldest year (last year in the recent 10)
  params2 = {
    "$where": f"crash_date between '{oldest_year}-01-01T00:00:00' and '{oldest_year}-12-31T23:59:59'",
    "$limit": 5000,
    "$offset" : 0
  }
  
  old_year_data = get_and_filter_data(params2)
  new_year_data = get_and_filter_data(params)
  
  # count total number of crashes
  def totalCrashes(collisions_data):
    return len(collisions_data)

  # count percentage of rush hour crashes
  def rushHour(collisions_data):
    morning_start = time(7, 0, 0)  # 7:00 AM
    morning_end = time(10, 0, 0)  # 10:00 AM
    afternoon_start = time(15, 0, 0)  # 3:00 PM
    afternoon_end = time(19, 0, 0)  # 7:00 PM

    # Count rush hour collisions for the current year
    rush_hour_morning = (collisions_data['crash_time'] >= morning_start) & (collisions_data['crash_time'] < morning_end)
    rush_hour_afternoon = (collisions_data['crash_time'] >= afternoon_start) & (collisions_data['crash_time'] < afternoon_end)
    
    return len(collisions_data[rush_hour_morning]) + len(collisions_data[rush_hour_afternoon])
  
  # count number of people injured and killed
  def injuredAndKilled(collisions_data):
    injured = int(collisions_data['number_of_persons_injured'].sum())
    killed = int(collisions_data['number_of_persons_killed'].sum())
    return [injured, killed]

  # calculate the number of crashes in each borough
  def byBorough(collisions_data):
    brooklyn = int(collisions_data['borough'].value_counts()["BROOKLYN"])
    queens = int(collisions_data['borough'].value_counts()["QUEENS"])
    bronx = int(collisions_data['borough'].value_counts()["BRONX"])
    manhattan = int(collisions_data['borough'].value_counts()["MANHATTAN"])
    staten_island = int(collisions_data['borough'].value_counts()["STATEN ISLAND"])
    
    return [brooklyn, queens, bronx, manhattan, staten_island]

  # count number of contributing factors
  def contributingFactors(collisions_data):
    count = collisions_data["contributing_factor_vehicle_1"].value_counts()
    count2 = collisions_data["contributing_factor_vehicle_2"].value_counts()
    combined_counts = count.add(count2, fill_value=0).astype(int)
    combined_counts = combined_counts.drop('Unspecified')
    combined_counts = combined_counts.sort_values(ascending=False)
    
    # select the top 10 counts
    top_10_counts = combined_counts.head(10)

    top_10_factors = []
    # insert each factor and their count into the array
    for factor, count in top_10_counts.items():
        top_10_factors.append([factor, count])
        
    return top_10_factors
  
  def vehicleTypes(collisions_data):
    count = collisions_data["vehicle_type_code1"].value_counts()
    count2 = collisions_data["vehicle_type_code2"].value_counts()
    combined_counts = count.add(count2, fill_value=0).astype(int)
    combined_counts = combined_counts.sort_values(ascending=False)

    # select the top 10 counts
    top_10_counts = combined_counts.head(10)
    
    top_10_vehicles = []
    # insert each vehicle type and their count into the array
    for vehicle, count in top_10_counts.items():
        top_10_vehicles.append([vehicle, count])
        
    return top_10_vehicles

  # calculate the number of pedestrians, cyclists, motorists and drivers injured/killed
  def pedestrian_cyclist_motorist_injured_killed(collisions_data):
    pedestrians_injured = int(collisions_data['number_of_pedestrians_injured'].sum())
    pedestrians_killed = int(collisions_data['number_of_pedestrians_killed'].sum())
    cyclists_injured = int(collisions_data['number_of_cyclist_injured'].sum())
    cyclists_killed = int(collisions_data['number_of_cyclist_killed'].sum())
    motorists_injured = int(collisions_data['number_of_motorist_injured'].sum())
    motorists_killed = int(collisions_data['number_of_motorist_killed'].sum())
    pedestrian_cyclist_motorist_injured_killed = [[pedestrians_injured, pedestrians_killed], [cyclists_injured, cyclists_killed], 
                                                  [motorists_injured, motorists_killed]]
    
    return pedestrian_cyclist_motorist_injured_killed
  
  # count number of contributing factors for last 10 years
  def contributingFactorsAll(collisions_data):
      count = collisions_data["contributing_factor_vehicle_1"].value_counts()
      count2 = collisions_data["contributing_factor_vehicle_2"].value_counts()
      combined_counts = count.add(count2, fill_value=0).astype(int)
      combined_counts = combined_counts.drop('Unspecified')
      combined_counts = combined_counts.sort_values(ascending=False)
      
      all_factors = []
      # insert each factor and their count into the array
      for factor, count in combined_counts.items():
          all_factors.append([factor, count])
      return all_factors

  # calculate the number of crashes for each vehicle type for last 10 years
  def vehicleTypesAll(collisions_data):
      count = collisions_data["vehicle_type_code1"].value_counts()
      count2 = collisions_data["vehicle_type_code2"].value_counts()
      if 'UNKNOWN' in count.index:
          count = count.drop('UNKNOWN', errors='ignore')
      
      if 'UNKNOWN' in count2.index:
          count2 = count2.drop('UNKNOWN', errors='ignore')
      combined_counts = count.add(count2, fill_value=0).astype(int)
      combined_counts = combined_counts.drop('UNKNOWN', errors='ignore')
      combined_counts = combined_counts.sort_values(ascending=False)
      # select the top 50 counts
      top_50_counts = combined_counts.head(50)
      all_vehicles = []
      # insert each vehicle type and their count into the array
      for vehicle, count in top_50_counts.items():
          all_vehicles.append([vehicle, count])
          
      return all_vehicles
  
  # add all the factors and counts of the new year to the contributing factors for recent 10 years chart
  def addRecentYearFactors(data, factors):
     for key in data.keys():  #key = ranking
        for factor in factors:
           if data[key][0] == factor[0]:  #factor[0] = factor; factor[1] = count
              data[key][1] = data[key][1] + factor[1]
  
  # remove all the factors and counts of the oldest year to the contributing factors for recent 10 years chart
  def removeOldestYearFactors(data, factors):
     for key in data.keys():
        for factor in factors:
           if data[key][0] == factor[0]:
              data[key][1] = data[key][1] - factor[1]

  # add all the vehicles and counts of the new year to the vehicle types for recent 10 years chart
  def addRecentYearVehicles(data, vehicles):
     for key in data.keys():
        for vehicle in vehicles:
           if data[key][0] == vehicle[0]:
              data[key][1] = data[key][1] + vehicle[1]

  # remove all the vehicles and counts of the oldest year to the vehicle types for recent 10 years chart
  def removeOldestYearVehicles(data, vehicles):
     for key in data.keys():
        for vehicle in vehicles:
           if data[key][0] == vehicle[0]:
              data[key][1] = data[key][1] - vehicle[1]
  
  # function to dump all the data for the newest year onto to JSON file except for contributing factors and vehicle types
  def jsonDump(total_crashes, rush_hour_counts, injured_and_killed_counts, borough_counts, contributing_factors_counts, 
            vehicle_types_counts, pedestrian_cyclist_motorist_injured_killed_counts):
    combined_data = {}  # Dictionary to hold combined data

    # Loop through each year and combine data into the JSON structure

    combined_data[previous_year] = {

      "total_crashes": total_crashes,
      "rush_hour_crashes": rush_hour_counts,
      "injured": injured_and_killed_counts[0],
      "killed": injured_and_killed_counts[1],
      "boroughs": {
          "brooklyn": borough_counts[0],
          "queens": borough_counts[1],
          "bronx": borough_counts[2],
          "manhattan": borough_counts[3],
          "staten_island": borough_counts[4]
      },
      "pedestrians": {
          "injured": pedestrian_cyclist_motorist_injured_killed_counts[0][0],
          "killed": pedestrian_cyclist_motorist_injured_killed_counts[0][1]
      },
      "cyclists": {
          "injured": pedestrian_cyclist_motorist_injured_killed_counts[1][0],
          "killed": pedestrian_cyclist_motorist_injured_killed_counts[1][1]
      },
      "motorists": {
          "injured": pedestrian_cyclist_motorist_injured_killed_counts[2][0],
          "killed": pedestrian_cyclist_motorist_injured_killed_counts[2][1]
      },
      "top_10": {
          "contributing_factors": {
              str(i+1): contributing_factors_counts[i] for i in range(10)
          },
          "vehicle_types": {
              str(i+1): vehicle_types_counts[i] for i in range(10)
          }
      }
    }

    file_path = os.path.join('..', 'front-end', 'src', 'data', 'crashes_data_visualization.json')
    
    # Write the results to a JSON file
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    new_data = { str(previous_year): combined_data[previous_year] }

    # if the previous year's data is not in the JSON file yet, add it
    if (str(previous_year) not in data or current_month > 1):
      data.update(new_data)
      with open(file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)
      print("crashes_data_visualization.json updated")
    else:
       print("crashes_data_visualization.json is already updated")
       return
  
  # function to dump all the data for the newest year and remove the data for the oldest year onto the JSON file for contributing factors and vehicle types
  def jsonDumpVehiclesFactors(factors_old_year, vehicles_old_year, factors_new_year, vehicles_new_year):
    file_path = os.path.join('..', 'front-end', 'src', 'data', 'crashes_data_visualization.json')
    file_path2 = os.path.join('..', 'front-end', 'src', 'data', 'factors_vehicles_visualization.json')

    #read json files
    with open(file_path, 'r') as json_file:
      data = json.load(json_file)
    with open(file_path2, 'r') as json_file:
      data2 = json.load(json_file)

    # if new year is not in data, add new year's calculations and remove the oldest year's calculations
    if (str(previous_year) not in data):
      addRecentYearFactors(data2['contributing_factors'], factors_new_year)
      removeOldestYearFactors(data2['contributing_factors'], factors_old_year)
      addRecentYearVehicles(data2['vehicle_types'], vehicles_new_year)
      removeOldestYearVehicles(data2['vehicle_types'], vehicles_old_year)

      # sort contributing factors by the counts in each factor
      sorted_contributing_factors = dict(sorted(data2['contributing_factors'].items(), key=lambda x: x[1][1], reverse=True))
      # sort vehicle types by the counts in each vehicle type
      sorted_vehicle_types = dict(sorted(data2['vehicle_types'].items(), key=lambda x: x[1][1], reverse=True))

      # reassign keys starting from 1
      sorted_contributing_factors = {str(i+1): value for i, (key, value) in enumerate(sorted_contributing_factors.items())}
      sorted_vehicle_types = {str(i+1): value for i, (key, value) in enumerate(sorted_vehicle_types.items())}

      # update the data
      data2['contributing_factors'] = sorted_contributing_factors
      data2['vehicle_types'] = sorted_vehicle_types

      #write to json file
      with open(file_path2, 'w') as json_file:
        json.dump(data2, json_file, indent=4)
      print("factors_vehicles_visualization.json updated")
    else:
      print("factors_vehicles_visualization.json is already updated")
      return
  
  # Call the functions to gather data and process it
  factors_old_year = contributingFactorsAll(old_year_data)
  vehicles_old_year = vehicleTypesAll(old_year_data)
  factors_new_year = contributingFactorsAll(new_year_data)
  vehicles_new_year = vehicleTypesAll(new_year_data)
  total_crash_counts = totalCrashes(new_year_data)  #get total crashes for each year
  rush_hour_counts = rushHour(new_year_data)  #get rush hour crashes for each year
  injured_and_killed_count = injuredAndKilled(new_year_data)  #get injured and killed counts for each year
  borough_counts = byBorough(new_year_data)
  contributing_factors_counts = contributingFactors(new_year_data)
  vehicle_types_counts = vehicleTypes(new_year_data)
  pedestrian_cyclist_motorist_injured_killed_counts = pedestrian_cyclist_motorist_injured_killed(new_year_data)

  #dump JSON file for vehicle types and contributing factors
  jsonDumpVehiclesFactors(factors_old_year, vehicles_old_year, factors_new_year, vehicles_new_year)
  #dump JSON file for everything except factors and vehicle types
  jsonDump(total_crash_counts, rush_hour_counts, injured_and_killed_count, borough_counts, contributing_factors_counts, 
           vehicle_types_counts, pedestrian_cyclist_motorist_injured_killed_counts)

if __name__ == "__main__":
   add_data_to_json()