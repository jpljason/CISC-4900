import React from "react";
import "../styles/evaluation.css"
import { MapContainer, TileLayer } from "react-leaflet"

export default function Evaluation() {

  return (
    <section>
      <h1>EVALUATION</h1>
      <center>
        <MapContainer center={[40.631015606268996, -73.95131852800579]} zoom={20} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      </center>
    </section>
  )
  
}