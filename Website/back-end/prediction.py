from flask import Flask, jsonify, request
import pandas as pd
import requests
import joblib

app = Flask(__name__)

model = joblib.load('') #model dump file name 'fileName.joblib'

@app.route("/prediction", methods=['POST'])

def predict():

  #TODO: include rest of columns included in localhost:5000

  if request.method == 'POST':
    data = request.get_json() #Get JSON data from request
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    number_of_crashes = data.get('number_of_crashes')
    number_of_persons_injured = data.get('number_of_persons_injured')
    number_of_persons_killed = data.get('number_of_persons_killed')

    # collisions_data = pd.DataFrame(response.json(), columns=columns_to_use)

    #DataFrame with appropriate column names
    input_data = pd.DataFrame([[latitude, longitude, number_of_crashes, number_of_persons_injured, number_of_persons_killed]], columns=['latitude', 'longitude', 'number_of_crashes', 'number_of_persons_injured', 'number_of_persons_killed'])

    prediction = model.predict(input_data)
    
    return jsonify({'prediction': prediction[0]})


if __name__ == '__main__':
  app.run(debug=True) 
