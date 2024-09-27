import React, { useState, useEffect } from "react";
import "../styles/evaluation.css"
import { MapContainer, TileLayer, GeoJSON, CircleMarker } from "react-leaflet"

function EvaluationCards(props){

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
      },
      {
        "type": "Feature",
        "properties": {
          "name": "1211 LORING AVENUE"
        },
        "geometry" : {
          "type": "LineString",
          "coordinates": [
            [-73.8665, 40.667202],
            [-73.97031852800579, 40.645015606268996]
          ]
        }
      }
    ]
  }

  const test = [40.667202,-73.8665];
  const test2 = "violet";
  
  //for severity: if else statements or switch based on people injured/killed and set colors accordingly (green, orange, red)
  //REMINDER: use 2+ examples from nyc opendata to map_data.js for testing purposes
  
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

  return (
    <div className="map-div">
      <center>
        <MapContainer
          className="map"
          id={props.id}
          center={[40.631015606268996, -73.95131852800579]} 
          zoom={20} 
          zoomControl={false}

        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={streetsGeoJson} style={streetStyle} />
          <CircleMarker
            center={test}
            radius={3}
            color="violet" // Outline
            fillColor={test2} // Fill
            fillOpacity={1.0}
          />

        </MapContainer>
      </center>
    </div>
  )
}

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
  return (
    <section className="evaluation-container" id="evaluation">
      <h1 className="evaluation-title">Evaluation<div className="horizontal-line"></div></h1>
      {/* <EvaluationCards id="map-container1"/> */}
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title">Severity by the Hour</h2>
          <Clock />
          <p className="map-description">Indicates how severe a crash will likely be at the current hour. Not severe indicatse no injuries or deaths, moderate severity indicates injuries, and very severe indicates deaths</p>
        </div>
        <div className="vertical-line"></div>
        <EvaluationCards />
      </div>
    </section>
  )
}