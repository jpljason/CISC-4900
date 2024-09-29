import React, { useState, useEffect } from "react";
import "../styles/evaluation.css"
import map_data from "./map_data"
import { MapContainer, TileLayer, GeoJSON, CircleMarker } from "react-leaflet"

const test = [40.63101, -73.95131];
const test2 = "violet";

function EvaluationCards(props){

  const getSeverity = (severity) => {
    if (severity.killed > 0)
      return 'red';
    if (severity.injured > 0)
      return 'yellow';
    return 'green';
  }

  function putMarker(){
    const severities = map_data.map(({latitude, longitude, injured, killed}) => 
      [latitude, longitude, injured, killed]
    );
    console.log(severities);
    for(var i=0; i<severities.length; i++){
      var lat = severities[i][0];
      var long = severities[i][1];
      var severity = getSeverity(severities[i]);
      return (
        <CircleMarker
          center={[40.63101, -73.95131]}  //Location
          radius={5}  //How big the circle is
          color={severity} // Outline
          fillColor={severity} // Fill
          fillOpacity={1.0}
        />
      )
    }
  }

  // center={test}  //Location
  // radius={5}  //How big the circle is
  // color={getSeverity} // Outline
  // fillColor={getSeverity} // Fill
  // fillOpacity={1.0}

  //Coloring streets (probably don't need)
  const streetsGeoJson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "BROOKLYN QUEENS EXPRESSWAY"
        },
        "geometry" : {
          "type": "LineString",
          "coordinates": [
            [-73.95131852800579, 40.631015606268996],
            [-73.96031852800579, 40.640015606268996],
            [-73.97031852800579, 40.645015606268996]
          ]
        }
      }
    ]
  }
  
  const streetStyle = (feature) => {
    switch (feature.properties.name) {
      case "BROOKLYN QUEENS EXPRESSWAY":
        return { color: "red", weight: 5 };
      case "1211 LORING AVENUE":
          return { color: "blue", weight: 5 };
      default:
        return { color: "black", weight: 5 };
    }
  };

  //for severity: if else statements or switch based on people injured/killed and set colors accordingly (green, orange, red)


  return (
    <div className="map-div">
      <center>
        <MapContainer
          className="map"
          id={props.id}
          center={[40.631015606268996, -73.95131852800579]} 
          zoom={12} 
          zoomControl={false}

        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <GeoJSON data={streetsGeoJson} style={streetStyle} /> */}
          
          {/* <CircleMarker
            center={test}  //Location
            radius={5}  //How big the circle is
            color={getSeverity} // Outline
            fillColor={getSeverity} // Fill
            fillOpacity={1.0}
          /> */}
          {putMarker()}
        </MapContainer>
      </center>
    </div>
  )
}


//Live clock displayed on the section
function Clock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="localTime">
      Current Time: <span className="time">{time.toLocaleTimeString()}</span>
    </div>
  );
}

export default function Evaluation() {
  //Switch between maps in the page
  const [activeContent, setActiveContent] = useState(true);

  function switchMap(){
    setActiveContent(!activeContent)
  }

  const renderContent = () => {
    return activeContent ? <Severity /> : <RecordedCrashes />
  }

  
  const Severity = () => (
    <div className = "map-container">
      <div className="details-section">
        <h2 className="map-title1">Severity by Hour</h2>
        <Clock />
        <p className="map-description">Indicates how severe a crash will likely be at the current hour. Not severe indicatse no injuries or deaths, moderate severity indicates injuries, and very severe indicates deaths</p>
      </div>
      <div className="vertical-line"></div>
      <EvaluationCards />
    </div>
  )

  const RecordedCrashes = () => (
    <div className = "map-container">
      <div className="details-section">
        <h2 className="map-title2">Recorded Crashes</h2>
        <div className="time-frame">Time Frame:</div>
        <div className="years">2012-2024</div>
        <p className="map-description">Details about crashes recorded in specific locations including total number of crashes, total injured/killed, most reoccuring contributing factor, etc</p>
      </div>
      <div className="vertical-line"></div>
      <EvaluationCards />
    </div>
  )


  return (
    <section className="evaluation-container" id="evaluation">
      <h1 className="evaluation-title">Evaluation<div className="horizontal-line"></div></h1>
      <div className="map-option">
        {/* <input id="toggle-on" className="toggle toggle-left" name="toggle" value="false" type="radio" checked></input>
        <label for="toggle-on" onClick={()=>setActiveContent('severity')} className="btn">Predicted Severity</label>
        <input id="toggle-off" className="toggle toggle-right" name="toggle" value="true" type="radio"></input>
        <label for="toggle-off" onClick={()=>setActiveContent('recordedCrashes')} className="btn">Recorded Crashes</label> */}
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