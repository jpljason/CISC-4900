import React, { useState, useEffect, useRef, memo } from "react";
import "../styles/evaluation.css";
import { useMap, MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";

//The main component of Evaluation
export default function Evaluation() {
  //Switch between maps in the page
  const [activeContent, setActiveContent] = useState('byLocation');

  const [popupByLocation, setPopupByLocation] = useState(null);

  // switch between maps when toggled
  const RenderContent = () => {
    if (activeContent === 'byLocation') {
      return <ByLocationSection />;
    } else {
      setPopupByLocation(null); // hardcoded, if the user goes to By Timeframe section, just set popupByLocation to false
      return <ByTimeframeSection />;
    }
  }

  // display a horizontal line
  const HorizontalLine = () => {
    return (
      <hr style={{
        borderColor: 'gray'
      }}/>
    )
  }
  // find zip code of a collision
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
  // find borough of a collision
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
  // find on street name of a collision
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
  // find off street name of a collision
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
  // find cross street name of a collision
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

  //Map for the By Location section
  const ByLocationMap = memo(({id, byLocation, setByLocation}) => {
    function PutMarker(){
      const markerRef = useRef();

      // auto open popup when a new marker is placed on the map
      useEffect(() => {
        if(markerRef.current && (byLocation && JSON.stringify(byLocation[byLocation.length-1]) !== '{}')) {
          markerRef.current.openPopup();
        }
      }, []);

      // put all the locations the user searched into markers on the map
      const allMarkers = byLocation.map((location) => {
        if(JSON.stringify(location) !== '{}'){
          return (
            <CircleMarker ref={markerRef} 
              center={[location.latitude, location.longitude]} //Location
              radius={7}  //Size of circle
              color={location !== byLocation[byLocation.length-1] ? "blue" : "green"} // most recent location searched is green, else blue
              fillColor={location !== byLocation[byLocation.length-1] ? "blue" : "green"} 
              fillOpacity={1.0}
            >
              <Popup className="location-popup">
                <div className="location-circlemarker-popup">
                  <div className="location-section">
                    <div className="details-title">Details: </div>
                    <HorizontalLine />
                    <div>Location: ({location.latitude}, {location.longitude})</div>
                    <HorizontalLine />
                    <div>Total Crashes: {location.number_of_crashes}</div>
                    <HorizontalLine />
                    <div>Total Injured: {location.number_of_persons_injured}</div>
                    <HorizontalLine />
                    <div>Total Killed: {location.number_of_persons_killed}</div>
                    <HorizontalLine />
                    <div>Total Crashes with 1+ Injuries: {location.crashes_with_injuries}</div>
                    <HorizontalLine />
                    <div>Total Crashes with 1+ Kills: {location.crashes_with_kills}</div>
                    <ZipCode collision={location} />
                    <Borough collision={location} />
                    <OnStreetName collision={location} />
                    <OffStreetName collision={location} />
                    <CrossStreetName collision={location} />
                  </div>
                  <div className="location-section">
                    <div className="predictions-title">Predictions:</div>
                    <HorizontalLine />
                    <div>Likelihood of Injury in a Crash : {Math.ceil((location.crashes_with_injuries/location.number_of_crashes)*100)} %</div>
                    <HorizontalLine />
                    <div>Likelihood of Death in a Crash : {Math.ceil((location.crashes_with_kills/location.number_of_crashes)*100)} %</div>
                    <div className="location-remove-button-wrapper"><button className="location-remove-button" onClick={() => {
                      const updatedByLocation = byLocation.filter(aLocation => aLocation.latitude !== location.latitude && aLocation.longitude !== location.longitude); //option for the user to remove a marker from the map
                      setByLocation(updatedByLocation);
                    }}>Remove Location</button></div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        }
      })
      return allMarkers;
    }
    
    //if there are markers on the map, go to the center of most recent one
    const latCenter = byLocation && JSON.stringify(byLocation[byLocation.length-1]) !== '{}' ? byLocation[byLocation.length-1].latitude : 40.7128;
    const longCenter = byLocation && JSON.stringify(byLocation[byLocation.length-1]) !== '{}' ? byLocation[byLocation.length-1].longitude : -74.0060;
    
    //Zooming into predicted marker using useMap() hook
    function ZoomToLocation(props){
      const map = useMap();
      useEffect(() => {
        if(map && byLocation){
          map.flyTo([props.latCenter, props.longCenter], 11, {
            animate: false
          });
        }
        else if(map && !byLocation){
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
            id={id}
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
            {byLocation && <PutMarker />}
            <ZoomToLocation byLocation={byLocation} latCenter={latCenter} longCenter={longCenter}/>
            <div className="location-map-info">
              <div><button onClick={() => {setByLocation([])}}>Clear All</button></div>
            </div>
          </MapContainer>
        </center>
      </div>
    )
  });

  //By Location section
  const ByLocationSection = () => {
    const latRef = useRef();
    const longRef = useRef();
    const [byLocation, setByLocation] = useState(() => {
      const savedPrediction = localStorage.getItem('byLocation');

      return savedPrediction ? JSON.parse(savedPrediction) : [];
    });

    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    // open error message
    const openModal = () => {
      setErrorMessage(true);
    };

    // close error message
    const closeModal = () => {
      //if the user presses no for nearest location or a location outside of NYC bounds was inserted, we remove it from the predictions array
      setByLocation((prevPrediction) => prevPrediction.slice(0, -1));
      setErrorMessage(false);
    };

    // fetch data for the default location (near Brooklyn College)
    const fetchDefault = async() => {
      const latitude = 40.631046
      const longitude = -73.95252
      const data = { latitude,longitude };
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
        setByLocation([...byLocation, jsonResponse]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // fetch data for default location if it's the 1st time entering the site
    useEffect(() => {
      if(byLocation.length == 0){
        fetchDefault();
      }
    }, []);

    //if user wants to see more data for a location in the By Timeframe map, add it to the By Location map
    useEffect(() => {
      if(popupByLocation !== null){
        setByLocation([...byLocation, popupByLocation]);
      }
    }, [popupByLocation]);

    // save all the markers inserted by the user into local storage
    useEffect(() => {
      localStorage.setItem('byLocation', JSON.stringify(byLocation));
      
      //useEffect only if latitude and longitude were already inserted by the user, alert the user if invalid latitude & longitude
      if(byLocation && JSON.stringify(byLocation[byLocation.length-1]) === '{}'){
        openModal();
      }
    }, [byLocation]);

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
        setByLocation([...byLocation, jsonResponse]); // Update the state with the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // if the user chooses, find the nearest avaliable location to the one the user searched
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
        // if the user wants the nearest location, it means the previous inserted location was invalid so we remove it 
        // and add the new nearest one to the predictions array
        setByLocation((prevPrediction) => {                         
          const slicedPrediction = prevPrediction.slice(0, -1);
          return [...slicedPrediction, jsonResponse];
        }); // Update the state with the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // remove loading screen after data is found
      setLoading(false);
    }

    // used to display a error message
    const ErrorMessage = () => {
      const latitude = latRef.current.value;
      const longitude = longRef.current.value;
      //if latitude/longitude is within NYC bounds, return an error message
      if((latitude >= 40.498947 && latitude <= 40.912884) && (longitude >= -74.25496 && longitude <= -73.70055)){
        return ( 
          <div>
            <div className="blur"></div>
            <dialog open className="popupMessage">
              <div>No current data for latitude/longitude!</div>
              <div className="nearest-message">Would you like data for the nearest location?</div>
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
    };

    // used to display a loading screen
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
    };

    return (
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title1">By Location</h2>
          <div className="time-frame">Time Frame:</div>
          <div className="years">2012 - Current</div>
          <p className="map-description">Indicates details of a specific location, including crashes details, and predicts the likelihood of injury or fatality in a crash at that location. The dataset must contain
            the entered latitude and longitude for the search. Default location is near Brooklyn College.
          </p>
          <div className="location-color-info">
            <div className="color" id="green"></div>
            <div>Most recent location</div>
          </div>
          <form onSubmit={handleSubmit} className="location-form">
            <label htmlFor="latitude">Latitude:</label>
            <input type="text"
            ref = {latRef}  
            required />
            <label htmlFor="longitude">Longitude:</label>
            <input type="text"
            ref = {longRef}       
            required />
            <button type="submit">Predict</button>
          </form>
        </div>
        <div className="vertical-line"></div>
        {errorMessage && <ErrorMessage />}
        {loading && <Loading />}
       <ByLocationMap byLocation={byLocation && byLocation.length ? byLocation : null} setByLocation={setByLocation}/>
      </div>
    );
  };

  //Map for the By Timeframe section
  const ByTimeframeMap = memo(({data, id}) => {
    const collisionsData = data;
    // states for the color counts and filter on top of the map
    const [red, setRed] = useState(0);
    const [yellow, setYellow] = useState(0);
    const [green, setGreen] = useState(0);
    const [total, setTotal] = useState(0);
    const [checkRed, setCheckRed] = useState(true);
    const [checkYellow, setCheckYellow] = useState(true);
    const [checkGreen, setCheckGreen] = useState(true);
    
    // grab the counts of each color 
    useEffect(() => {
      const getColorCount = () => {
        let redCount = 0, yellowCount = 0, greenCount = 0;
        collisionsData.forEach(collision => {
          if(getSeverity(collision) === 'red')
            redCount++;
          else if(getSeverity(collision) === 'yellow')
            yellowCount++;
          else
            greenCount++;
        })
        setRed(redCount);
        setYellow(yellowCount);
        setGreen(greenCount);
        setTotal(redCount+yellowCount+greenCount);
      }
      getColorCount();
    }, [collisionsData]);
  
    //returns the color of the severity of crashes
    const getSeverity = (item) => {
      if (item.number_of_persons_killed > 0){
        return 'red';
      }
      else if (item.number_of_persons_injured > 0){
        return 'yellow';
      }
      else
        return 'green';
    }

    //if the user wants to see more data on the crashes for a specific location
    const handleByLocation = async(collision) => {
      const latitude = collision.latitude
      const longitude = collision.longitude
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
        setActiveContent("byLocation");  // go to "by location" section
        setPopupByLocation(jsonResponse) // Update the state with the response data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    //returns all the marker components to insert onto the map
    function PutMarker(){
      const canvasRenderer = L.canvas();
      const allMarkers = collisionsData.map((collision, index) => {
        const color = getSeverity(collision);
        if((color === 'red' && checkRed) || (color === 'green' && checkGreen) || (color === 'yellow' && checkYellow)){
          return (
            <CircleMarker 
              key={index}
              center={[collision.latitude, collision.longitude]}  //Location
              radius={4}  //Size of circle
              color={color} //Outline
              fillColor={color} //Fill
              fillOpacity={1.0}
              renderer={canvasRenderer}
            >
            <Popup>
              <div className="timeframe-circlemarker-popup">
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
                <button className="more-crashes-button" onClick={() => handleByLocation(collision)}>More Crashes</button> 
              </div>
            </Popup>
            </CircleMarker>
          )
        }
      })
      return allMarkers;
    }
  
    return (
      <div className="map-div">
        <center>
          <MapContainer
            id={id}
            className="map"
            center={[40.7128, -74.0060]} //Center of NYC
            zoom={11}
            zoomControl={false}
            minZoom={10}
            maxBounds={[[40.4, -74.5], [41.2, -73.4]]}  //[South, West] [North, East]
            maxBoundsViscosity={1.0}
          >
            <div className="by-timeframe-info">
              <div className="color-counts">
                <div className="total"><div className="total-crashes">Total: </div>{total}</div>
                {checkRed && <div className="count-item"><div className="color" id="red"></div>{red}</div>}
                {checkYellow && <div className="count-item"><div className="color" id="yellow"></div>{yellow}</div>}
                {checkGreen && <div className="count-item"><div className="color" id="green"></div>{green}</div>}
              </div>
              <div className="filter-colors">
                <div className="filter">Filter:</div>
                <input onChange={() => {
                  setCheckRed(prevCheckRed => !prevCheckRed);
                  setTotal(!checkRed ? prevTotal => prevTotal+red : prevTotal => prevTotal-red);
                }} checked={checkRed} type="checkbox" value="red"></input>
                <label for="red"><div className="color" id="red"></div></label>
                <input onChange={() => {
                  setCheckGreen(prevCheckGreen => !prevCheckGreen);
                  setTotal(!checkGreen ? prevTotal => prevTotal+green : prevTotal => prevTotal-green);
                }} checked={checkGreen} type="checkbox" value="green"></input>
                <label for="green"><div className="color" id="green"></div></label>
                <input onChange={() => {
                  setCheckYellow(prevCheckYellow => !prevCheckYellow);
                  setTotal(!checkYellow ? prevTotal => prevTotal+yellow : prevTotal => prevTotal-yellow);
                }} checked={checkYellow} type="checkbox" value="yellow"></input>
                <label for="yellow"><div className="color" id="yellow"></div></label>
              </div>
            </div>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <PutMarker />
          </MapContainer>
        </center>
      </div>
    )
  });

  //By Timeframe section's map component
  const ByTimeframeSection = () => {
    const date = new Date();
    // initial month for the map is this month
    const [month, setMonth] = useState(date.getMonth()+1);
    // initial year for the map is this year
    const [year, setYear] = useState(date.getFullYear());
    // determines whether user chose a month so that it can display the year dropdown after
    const [monthSet, setMonthSet] = useState(false);
    // holds the data for the specific time frame
    const [data, setData] = useState([]);
    const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    // determines whether map is still loading or not
    const [loading, setLoading] = useState(false);
    // display date on website after user searches for a specific time frame
    const [displayDate, setDisplayDate] = useState(`${monthLabels[month-1]} ${year}`)
    const [errorMessage, setErrorMessage] = useState(false);

    // intitial fetch of data for the current month and year
    useEffect( () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = { month, year }
          const response = await fetch('/api/collisions', {
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
          setData(jsonResponse) // Update the state with the response data
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
          setErrorMessage(true);
        }
      };
      fetchData();
    }, []);
    
    // displays all the avaliable months in the dropdown
    const monthOptions = () => {
      const options = monthLabels.map((month, index) => {
        return (
          <option key={index} value={index + 1}>
            {month}
          </option>
        );
      });
      return options;
    };

    // displays all the avaliable years for the month chosen in the dropdown
    const yearOptions = () => {
      const startingYear = month >= 7 ? 2012 : 2013
      const endingYear = month <= date.getMonth()+1 ? date.getFullYear() : date.getFullYear()-1
      const allYears = [];
      for(let year = startingYear; year <= endingYear; year++){
        allYears.push(year);
      }
      const options = allYears.map(year => {
        return (
          <option value={year}>
            {year}
          </option>
        );
      });
      return options;
    }

    // fetch the data for the specific month and year the user chose
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission
      setLoading(true);
      // Create an object with the month and year
      const data = { month, year };
      try {
        const response = await fetch('/api/collisions', {
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
        setData(jsonResponse) // Update the state with the response data
        setLoading(false);
        setDisplayDate(`${monthLabels[month-1]} ${year}`);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);  
        setErrorMessage(true);  //display error message if data cannot be found
      }
    }

    // display error message if there is no avaliable data for month and year
    const ErrorMessage = () => {
      return (
        <div>
          <div className="blur"></div>
          <dialog open className="popupMessage">
            <div>No avaliable data for {monthLabels[month-1]} {year}</div>
            <button onClick={() => setErrorMessage(false)} className="error-button1">Close</button>
          </dialog>
        </div>
      )
    }

    // display loading screen when the map is not rendered yet
    const Loading = () => {
      return (
        <div>
          <div className="blur"></div>
          <dialog open className="popupMessage">
            <div className="loading-container">
              Loading data into map...<img className="loading-car" src={require("../images/mini-car.gif")} alt="Loading Car"/>
            </div>
          </dialog>
        </div>
      )
    }

    return (
      <div className = "map-container">
        <div className="details-section">
          <h2 className="map-title2">By Timeframe</h2>
          <div className="time-frame">Time Frame:</div>
          <div className="years">{displayDate}</div>
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
          <p className="map-description">Clicking on each marker displays details about crashes recorded in that location including total number of crashes, total injured/killed, borough, street name, etc. There is also an option to see more information on all the crashes in that location. Default timeframe is current month and year.
          </p>
          <form className="by-timeframe-search" onSubmit={handleSubmit}>
            <label for="month">Select a month:  </label>
            <select className="select" onChange={(e) => {
              setMonth(e.target.value);
              setMonthSet(true);
              }}>
              <option disabled selected value></option>
              {monthOptions()}
            </select>
            {monthSet && (
            <div className="bytimeframe-search">
              <div>
                <label for="year">Select a year:  </label>
                <select className="select" onChange={(e) => setYear(e.target.value)}>
                  <option disabled selected value></option>
                  {yearOptions()}
                </select>
              </div>
              <button className="by-timeframe-button" type="submit">
                Go
              </button>
            </div>
            )}
          </form>
        </div>
        <div className="vertical-line"></div>
        <ByTimeframeMap data={data}/>
        {loading && <Loading />}
        {errorMessage && <ErrorMessage />}
      </div>
    )
  }

  return (
    <section className="evaluation-container" id="evaluation">
      <h1 className="evaluation-title">Evaluation<div className="horizontal-line"></div></h1>
      <ul className="toggle-section2">
        <li
        style={{ backgroundColor: activeContent === "byLocation" ? "rgb(181, 0, 213)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (activeContent !== "byLocation" ? "rgb(37, 37, 37)" : "rgb(181, 0, 213)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (activeContent !== "byLocation" ? "rgb(23, 23, 23)" : "rgb(181, 0, 213)")} 
        onClick={() => setActiveContent("byLocation")}>By Location</li>
        <li 
        style={{ backgroundColor: activeContent === "byTimeframe" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (activeContent !== "byTimeframe" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (activeContent !== "byTimeframe" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setActiveContent("byTimeframe")}>By Timeframe</li>
      </ul>
      <RenderContent />
    </section>
  );
}