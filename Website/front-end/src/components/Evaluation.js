import React, { useState, useEffect } from "react";
import "../styles/evaluation.css";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";

const HorizontalLine = () => {
  return (
    <hr style={{
      borderColor: 'gray'
    }}/>
  )
}
const ZipCode = ({collision}) => {
  if(collision.zip_code!=null){
    return (
      <div>
        <HorizontalLine />
        <div>Zip Code : {collision.zip_code}</div>
      </div>
    )
  }
}
const Borough = ({collision}) => {
  if(collision.borough!=null){
    return (
      <div>
        <HorizontalLine />
        <div>Borough : {collision.borough}</div>
      </div>
    )
  }
}
const OnStreetName = ({collision}) => {
  if(collision.on_street_name!=null){
    return (
      <div>
        <HorizontalLine />
        <div>On Street Name : {collision.on_street_name}</div>
      </div>
    )
  }
}
const OffStreetName = ({collision}) => {
  if(collision.off_street_name!=null){
    return (
      <div>
        <HorizontalLine />
        <div>Off Street Name : {collision.off_street_name}</div>
      </div>
    )
  }
}
const CrossStreetName = ({collision}) => {
  if(collision.cross_street_name!=null){
    return (
      <div>
        <HorizontalLine />
        <div>Cross Street Name : {collision.cross_street_name}</div>
      </div>
    )
  }
}
//Map for the predicted severities
function PredictedSeveritiesMap(props){
  function putMarker(){ 
    return (
      <CircleMarker 
        center={[props.prediction.latitude, props.prediction.longitude]}  //Location
        radius={6}  //Size of circle
        color="blue" //Outline
        fillColor="blue" //Fill
        fillOpacity={1.0}
      >
        <Popup>
          <div className="circlemarker-popup">
            <div>Injured : {props.prediction.number_of_persons_injured}</div>
            <HorizontalLine />
            <div>Killed : {props.prediction.number_of_persons_killed}</div>
            <HorizontalLine />
            <div>Total Crashes : {props.prediction.number_of_crashes}</div>
            <ZipCode collision={props.prediction} />
            <Borough collision={props.prediction} />
            <OnStreetName collision={props.prediction} />
            <OffStreetName collision={props.prediction} />
            <CrossStreetName collision={props.prediction} />
          </div>
        </Popup>
      </CircleMarker>
    )
  }
  const latCenter = props.prediction === null ? 40.7128 : props.prediction.latitude
  const longCenter = props.prediction === null ? -74.0060 : props.prediction.longitude
  return (
    <div className="map-div">
      <center>
        <MapContainer
          className="map"
          id={props.id}
          center={[latCenter, longCenter]} //TODO: change center of view
          zoom={10} 
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {props.prediction !== null ? putMarker() : ""}
        </MapContainer>
      </center>
    </div>
  )
}
//Map for the recorded crashes
function RecordedCrashesMap(props){
  const [collisionsData, setCollisionsData] = useState([]);
  //Fetching from the backend server that contains the data from the API
  useEffect(() => {
    fetch("/api/collisions")
    .then(
      res => res.json()
    )
    .then(
      data => {
        setCollisionsData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  console.log(collisionsData)

  //returns the color of the severity of crashes
  const getSeverity = (item) => {
    if (item.number_of_persons_killed > 0)
      return 'red';
    if (item.number_of_persons_injured > 0)
      return 'yellow';
    return 'green';
  }
  
  //returns all the marker components to insert onto the map
  function putMarker(){
    const severities = collisionsData.map((collision, index) => (
      <CircleMarker 
        key={index}
        center={[collision.latitude, collision.longitude]}  //Location
        radius={4}  //Size of circle
        color={getSeverity(collision)} //Outline
        fillColor={getSeverity(collision)} //Fill
        fillOpacity={1.0}
      >
        <Popup>
          <div className="circlemarker-popup">
            <div>Injured : {collision.number_of_persons_injured}</div>
            <HorizontalLine />
            <div>Killed : {collision.number_of_persons_killed}</div>
            <HorizontalLine />
            <div>Total Crashes : {collision.number_of_crashes}</div>
            <ZipCode collision={collision} />
            <Borough collision={collision} />
            <OnStreetName collision={collision} />
            <OffStreetName collision={collision} />
            <CrossStreetName collision={collision} />
          </div>
        </Popup>
      </CircleMarker>
    ))
    return severities;
  }

  return (
    <div className="map-div">
      <center>
        <MapContainer
          className="map"
          id={props.id}
          center={[40.7128, -74.0060]} //Center of NYC
          zoom={11} 
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* <GeoJSON data={streetsGeoJson} style={streetStyle} /> */}
          {putMarker()}
        </MapContainer>
      </center>
    </div>
  )
}

//The main component of Evaluation
export default function Evaluation() {
  //Switch between maps in the page
  const [activeContent, setActiveContent] = useState(true);

  //Function that switches the map when the toggle button is clicked
  function switchMap(){
    setActiveContent(!activeContent)
  }

  const renderContent = () => {
    return activeContent ? <Severity /> : <RecordedCrashes />
  }

  //Predicted severity map component
  const Severity = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [prediction, setPrediction] = useState(null);

    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Create an object with the latitude and longitude
      const data = { latitude, longitude };

      try {
        const response = await fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify(data)
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonResponse = await response.json(); // Parse the JSON response
        setPrediction(jsonResponse); // Update the state with the response data
        console.log(prediction);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    return (
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title1">Predict Severity</h2>
          <p className="map-description">Indicates how severe a crash will likely be at the current hour. Not severe indicates no injuries or deaths, moderate severity indicates injuries, and very severe indicates deaths</p>
          <form onSubmit={handleSubmit} className="predict-form">
            <label for="latitude">Latitude:</label>
            <input type="text" 
            value={latitude} onChange={(e) => setLatitude(e.target.value)}
            required />
            <label for="longitude">Longitude:</label>
            <input type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required />
            <button type="submit">Predict</button>
          </form>
        </div>
        <div className="vertical-line"></div>
       <PredictedSeveritiesMap prediction={prediction !== null ? prediction[0] : null}/>
      </div>
    );
  };

  //Recorded crashes map component
  const RecordedCrashes = () => (
    <div className = "map-container">
      <div className="details-section">
        <h2 className="map-title2">Recorded Crashes</h2>
        <div className="time-frame">Time Frame:</div>
        <div className="years">September 2024</div>
        <div className="legend">
          <div className="color-container">
            <div className="color" id="green"></div>
            <div className="color-description">No injuries/deaths</div>
          </div>
          <div className="color-container">
            <div className="color" id="yellow"></div>
            <div className="color-description">Has injuries, no deaths</div>
          </div>
          <div className="color-container">
            <div className="color" id="red"></div>
            <div className="color-description">Has deaths</div>
          </div>
        </div>
        <p className="map-description">Details about crashes recorded in specific locations including total number of crashes, total injured/killed, most reoccuring contributing factor, etc</p>
      </div>
      <div className="vertical-line"></div>
      <RecordedCrashesMap />
    </div>
  )

  return (
    <section className="evaluation-container" id="evaluation">
      <h1 className="evaluation-title">Evaluation<div className="horizontal-line"></div></h1>
      <div className="map-option">
        <input type="checkbox" id="toggle" className="toggleCheckbox" />
        <label onClick={switchMap} htmlFor="toggle" className='toggleContainer'>
          <div>Predicted Severity</div>   
          <div>Recorded Crashes</div>
        </label>
      </div>
      {renderContent()}
    </section>
  );
}

// //Coloring streets (probably don't need)
  // const streetsGeoJson = {
  //   "type": "FeatureCollection",
  //   "features": [
  //     {
  //       "type": "Feature",
  //       "properties": {
  //         "name": "BROOKLYN QUEENS EXPRESSWAY"
  //       },
  //       "geometry" : {
  //         "type": "LineString",
  //         "coordinates": [
  //           [-73.95131852800579, 40.631015606268996],
  //           [-73.96031852800579, 40.640015606268996],
  //           [-73.97031852800579, 40.645015606268996]
  //         ]
  //       }
  //     }
  //   ]
  // }
  
  // const streetStyle = (feature) => {
  //   switch (feature.properties.name) {
  //     case "BROOKLYN QUEENS EXPRESSWAY":
  //       return { color: "red", weight: 5 };
  //     case "1211 LORING AVENUE":
  //         return { color: "blue", weight: 5 };
  //     default:
  //       return { color: "black", weight: 5 };
  //   }
  // };