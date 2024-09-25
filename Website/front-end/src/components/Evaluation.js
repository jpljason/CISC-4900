import React from "react";
import "../styles/evaluation.css"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

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
      }
    ]
  }

  
  const streetStyle = (feature) => {
    switch (feature.properties.name) {
      case "BROOKLYN QUEENS EXPRESSWAY":
        return { color: "red", weight: 5 };
      default:
        return { color: "black", weight: 5 };
    }
  };

  return (
    <div>
      <center>
        <MapContainer center={[40.631015606268996, -73.95131852800579]} zoom={20} className="map-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={streetsGeoJson} style={streetStyle} />
        </MapContainer>
      </center>
    </div>
  )
}

export default function Evaluation() {
  return (
    <section className="evaluation-container">
      <div id="evaluation"></div>
      <h1 className="evaluation-title">Evaluation<div className="horizontal-line"></div></h1>
      <EvaluationCards />
      <EvaluationCards />
    </section>
  )
}