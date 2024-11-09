import React, { useState, useEffect, useRef } from "react";
import "../styles/evaluation.css";
import { useMap, MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";

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
  return null;
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
  return null;
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
  return null;
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
  return null;
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
  return null;
}

//Map for the predicted severities
function PredictedSeveritiesMap(props){
  function PutMarker(){
    const markerRef = useRef();

    useEffect(() => {
      if(markerRef.current) {
        markerRef.current.openPopup();
      }
    }, []);
    
    return (
      <CircleMarker ref={markerRef} 
        center={[props.prediction.latitude, props.prediction.longitude]}  //Location
        radius={7}  //Size of circle
        color="blue" //Outline
        fillColor="blue" //Fill
        fillOpacity={1.0}
      >
        <Popup className="predict-popup">
          <div className="predicted-circlemarker-popup">
            <div className="predicted-section">
              <div className="details-title">Details: </div>
              <HorizontalLine />
              <div>Location: ({props.prediction.latitude}, {props.prediction.longitude})</div>
              <HorizontalLine />
              <div>Total Crashes: {props.prediction.number_of_crashes}</div>
              <HorizontalLine />
              <div>Total Injured: {props.prediction.number_of_persons_injured}</div>
              <HorizontalLine />
              <div>Total Killed: {props.prediction.number_of_persons_killed}</div>
              <HorizontalLine />
              <div>Total Crashes with 1+ Injuries: {props.prediction.crashes_with_injuries}</div>
              <HorizontalLine />
              <div>Total Crashes with 1+ Kills: {props.prediction.crashes_with_kills}</div>
              <ZipCode collision={props.prediction} />
              <Borough collision={props.prediction} />
              <OnStreetName collision={props.prediction} />
              <OffStreetName collision={props.prediction} />
              <CrossStreetName collision={props.prediction} />
            </div>
            <div className="predicted-section">
              <div className="predictions-title">Predictions:</div>
              <HorizontalLine />
              <div>Likelihood of Injury in a Crash : {Math.ceil((props.prediction.crashes_with_injuries/props.prediction.number_of_crashes)*100)} %</div>
              <HorizontalLine />
              <div>Likelihood of Death in a Crash : {Math.ceil((props.prediction.crashes_with_kills/props.prediction.number_of_crashes)*100)} %</div>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    )
  }

  const latCenter = props.prediction ? props.prediction.latitude : 40.7128;
  const longCenter = props.prediction ? props.prediction.longitude : -74.0060;

  //Zooming into predicted marker using useMap() hook
  function ZoomToPrediction(props){
    const map = useMap();
    useEffect(() => {
      if(map && props.prediction){
        map.flyTo([props.latCenter, props.longCenter], 16, {
          animate: false
        });
      }
      else if(map && !props.prediction){
        map.setView([props.latCenter, props.longCenter], 11);
      }
    }, []);
    return null;
  }

  return (
    <div className="map-div">
      <center>
        <MapContainer
          className="map"
          id={props.id}
          center={[latCenter, longCenter]} //TODO: change center of view
          zoom={11} 
          zoomControl={false}
          minZoom={10}
          maxBounds={[[40.4, -74.5], [41.2, -73.4]]}  //[South, West] [North, East]
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {props.prediction && <PutMarker />}
          <ZoomToPrediction prediction={props.prediction} latCenter={latCenter} longCenter={longCenter}/>
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

  //returns the color of the severity of crashes
  const getSeverity = (item) => {
    if (item.number_of_persons_killed > 0)
      return 'red';
    if (item.number_of_persons_injured > 0)
      return 'yellow';
    return 'green';
  }
  
  //returns all the marker components to insert onto the map
  function PutMarker(){
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
        <div className="recorded-circlemarker-popup">
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
          minZoom={10}
          maxBounds={[[40.4, -74.5], [41.2, -73.4]]}  //[South, West] [North, East]
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* <GeoJSON data={streetsGeoJson} style={streetStyle} /> */}
          <PutMarker />
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

  const RenderContent = () => {
    return activeContent ? <Severity /> : <RecordedCrashes />
  }

  //Predicted severity map component
  const Severity = () => {
    const latRef = useRef();
    const longRef = useRef();
    const [prediction, setPrediction] = useState([{
      "borough": "BROOKLYN",
      "cross_street_name": "2933 BEDFORD AVENUE",
      "crashes_with_injuries": 0,
      "crashes_with_kills": 0,
      "latitude": 40.631046,
      "longitude": -73.95252,
      "number_of_crashes": 1,
      "number_of_persons_injured": 0.0,
      "number_of_persons_killed": 0.0,
      "off_street_name": null,
      "on_street_name": null,
      "zip_code": "11210"
    }]);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const openModal = () => {
      setErrorMessage(true);
    }
    const closeModal = () => {
      setErrorMessage(false);
    }

    useEffect(() => {
      //useEffect only if latitude and longitude were already inserted by the user, alert the user if invalid latitude & longitude
      if(prediction && prediction.length === 0){
        openModal();
      }
      else{
        closeModal();
      }
    }, [prediction]);

    //handle the responses and errors when trying to gather the data for the user's lat and long
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission
      // Get lat and long values from input
      const latitude = latRef.current.value;
      const longitude = longRef.current.value;
      // Create an object with the latitude and longitude
      const data = { latitude , longitude };

      try {
        const response = await fetch('/submit', {
          method: 'POST', // POST is a method that requests that a web server accepts the data enclosed in the body of the request message
          headers: {
            'Content-Type': 'application/json', // Informing the server that the data in body is JSON
          },
          body: JSON.stringify(data)  // Convert data to a JSON string
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonResponse = await response.json(); // Parse the JSON response
        setPrediction(jsonResponse); // Update the state with the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const handleNearest = async () => {
      const latitude = latRef.current.value;
      const longitude = longRef.current.value;
      const data = { latitude , longitude };
      // notify user that it is finding the nearest location with a loading screen
      setLoading(true);
      setErrorMessage(false);

      try {
        const response = await fetch('/nearest', {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // remove loading screen after data is found
      setLoading(false);
    }

    const Modal = () => {
      const latitude = latRef.current.value;
      const longitude = longRef.current.value;
      //if latitude/longitude is within NYC bounds, return no predictions message
      if((latitude >= 40.498947 && latitude <= 40.912884) && (longitude >= -74.25496 && longitude <= -73.70055)){
        return ( 
          <div>
            <div className="blur"></div>
            <dialog open className="popupMessage">
              <div>No current predictions for latitude/longitude!</div>
              <div className="nearest-message">Would you like predictions for the nearest location?</div>
              <button onClick={handleNearest} className="error-button1">Yes</button>
              <button onClick={closeModal} className="error-button2">No</button>
            </dialog>
          </div>
        )
      }
      //if latitude/longitude isn't within NYC bounds, return message indicating not within NYC bounds
      else{
        return (
          <div>
            <div className="blur"></div>
            <dialog open className="popupMessage">
              <div>Latitude/Longitude isn't within NYC bounds!</div>
              <button onClick={closeModal} className="error-button1">Close</button>
            </dialog>
          </div>
        )
      }
    }

    const Loading = () => {
      return (
        <div>
          <div className="blur"></div>
          <dialog open className="popupMessage">
            <div className="loading-container">
              Loading Nearest Location...<img className="loading-car" src={require("../images/mini-car.gif")} alt="Loading Car"/>
            </div>
          </dialog>
        </div>
      )
    }

    return (
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title1">Predict Severity</h2>
          <div className="time-frame">Time Frame:</div>
          <div className="years">2012 - Current</div>
          <p className="map-description">Indicates details of a specific location and its crashes and predicts how likely a person will be injured/killed in the event of a crash in that location. The dataset must contain
            the inserted latitude/longitude to make predictions. Default location is near Brooklyn College.
          </p>
          <form onSubmit={handleSubmit} className="predict-form">
            <label htmlFor="latitude">Latitude:</label>
            <input type="text"
            ref = {latRef}
            // value={latitude} onChange={(e) => setLatitude(e.target.value)}
            required />
            <label htmlFor="longitude">Longitude:</label>
            <input type="text"
            ref = {longRef}
            // value={longitude} onChange={(e) => setLongitude(e.target.value)}
            required />
            <button type="submit">Predict</button>
          </form>
        </div>
        <div className="vertical-line"></div>
        {errorMessage && <Modal />}
        {loading && <Loading />}
       <PredictedSeveritiesMap prediction={prediction ? prediction[0] : null}/>
      </div>
    );
  };

  //Recorded crashes map component
  const RecordedCrashes = () => {
    const dataMonthAndYear = () => {
      const date = new Date();
      let currentMonth = date.getMonth();
      let currentDay = date.getDate();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      let previousMonth = currentMonth == 0 ? 11 : currentMonth-1
      let currentYear = currentMonth == 0 ? date.getFullYear()-1 : date.getFullYear()
      const twoMonthsAgo = () => {
        if(currentMonth == 0){
          return 10;
        }
        else if(currentMonth == 1){
          return 11;
        }
        else{
          return currentMonth-2;
        }
      }
      const twoMonthsAgoYear = () => {
        if(currentMonth == 0 || currentMonth == 1){
          return date.getFullYear()-1;
        }
        else{
          return date.getFullYear();
        }
      }
      if(currentDay >= 5){
        return (
          <div>{monthNames[previousMonth]} {currentYear}</div>
        )
      }
      else{
        return (
          <div>{monthNames[twoMonthsAgo()]} {twoMonthsAgoYear()}</div>
        )
      }
    }
    return (
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title2">Recorded Crashes</h2>
          <div className="time-frame">Time Frame:</div>
          <div className="years">{dataMonthAndYear()}</div>
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
          <p className="map-description">Clicking on each marker displays details about crashes recorded in that location including total number of crashes, total injured/killed, borough, street name, etc</p>
        </div>
        <div className="vertical-line"></div>
        <RecordedCrashesMap />
      </div>
    )
  }

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
      <RenderContent />
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