import React, { useState, useEffect } from "react";
import "../styles/evaluation.css";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";

function EvaluationCards(props){
  

  //Fetching from the backend server that contains the data from the API
  const [collisionsData, setCollisionsData] = useState([]);

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
    const severities = collisionsData.map((collision, index) => (
      <CircleMarker 
        key={index}
        center={[collision.latitude, collision.longitude]}  //Location
        radius={4}  //How big the circle is
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
          center={[40.7128, -74.0060]} //TODO: change center of view
          zoom={11} 
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" */}

          {/* attribution= '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png' */}

          {/* <GeoJSON data={streetsGeoJson} style={streetStyle} /> */}
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

  //Recorded crashes map component
  const RecordedCrashes = () => (
    <div className = "map-container">
      <div className="details-section">
        <h2 className="map-title2">Recorded Crashes</h2>
        <div className="time-frame">Time Frame:</div>
        <div className="years">September 2024</div>
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