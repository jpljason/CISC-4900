import React, { useState, useEffect } from "react";
import "../styles/overview.css"

export default function Overview() {
  const [section, setSection] = useState('goals');
  
  // navigation bar for our overview section
  const OverviewNavigation = () => {
    return (
      <ul className="overview-nav">
        <li
        style={{ backgroundColor: section === "goals" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (section !== "goals" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (section !== "goals" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setSection("goals")}>Goals</li>
        <li
        style={{ backgroundColor: section === "data-filtering" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (section !== "data-filtering" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (section !== "data-filtering" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setSection("data-filtering")}>Data Filtering</li>
        <li
        style={{ backgroundColor: section === "maps" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (section !== "maps" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (section !== "maps" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setSection("maps")}>Our Maps</li>
        <li 
        style={{ backgroundColor: section === "charts" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (section !== "charts" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (section !== "charts" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setSection("charts")}>Charts/Graphs</li>
        <li 
        style={{ backgroundColor: section === "limitations" ? "rgb(28, 28, 206)" : "rgb(23, 23, 23)"}}
        onMouseEnter={(e) => e.target.style.backgroundColor = (section !== "limitations" ? "rgb(37, 37, 37)" : "rgb(28, 28, 206)")}
        onMouseLeave = {(e) => e.target.style.backgroundColor = (section !== "limitations" ? "rgb(23, 23, 23)" : "rgb(28, 28, 206)")}
        onClick={() => setSection("limitations")}>Limitations</li>
      </ul>
    )
  }
  // section for our goals
  const GoalsSection = () => {
    return (
      <div className="overview-section">
        <img className="image" src={require("../images/nyc-roads.png")} alt="NYC Roads" />
        <div className="text">
          <h2 className="title">Goals</h2>
          <div className="description">
            Vehicle crashes occur frequently in New York City, posing risks to public safety. We aim to raise awareness and provide data analysis to assist officials identify the locations and causes of these crashes. Users are encouraged to explore, draw their own conclusions, and utilize this site for personal use.
          </div>
        </div>
      </div>
    )
  }

  // section for our data-filtering
  const DataFilteringSection = () => {
    return (
      <div className="overview-section">
        <img className="image" src={require("../images/data-filtering.png")} />
        <div className="text">
          <h2 className="title">Data Filtering</h2>
          <div className="description">
            The Motor Vehicles Collisions dataset is not perfect. Some rows were filtered out that were not located in NYC bounds and some had invalid latitudes/longitudes listed as 0.000000, which were filtered out as well. Additionally, some rows contained invalid values in specific columns.
          </div>
        </div>
      </div>
    )
  }

  // section for our maps
  const OurMapsSection = () => {
    return (
      <div className="overview-section">
        <img className="image" src={require("../images/maps-image.jpg")} alt="NYC Map"/>
        <div className="text">
          <h2 className="title">Our Maps</h2>
          <div className="description">We created two different maps for the user to interact with, the By Location map and the By Timeframe map. 
            <div className="spacing">The By Location map offers information and predictions on the crashes of a specific location inserted by the user. Location is based on latitude/longitude and these two values must be contained inside the Motor Vehicle Collisions dataset. If the user enters a valid NYC location that isn't within the dataset, the option to go to the nearest available location is offered. The two predictions offered include likelihood of injury in a crash and likelihood of death in a crash. This is calculated by analyzing the total number of crashes that have at least 1 injury or death and comparing it to the total number of crashes that occured in that location. All the data regarding the specific location is based on the most recent update offered by the dataset.</div>
            <div className="spacing">The By Timeframe map offers details on all the crashes recorded since the previous month. Details such as borough and street names are only included if it is offered in the dataset, otherwise it is excluded. The user can also choose a specific timeframe, month and year, that they want to see on the map. The map will then load the corresponding crashes for that timeframe.</div>
          </div>
        </div>
      </div>
    )
  }

  // section for our charts
  const ChartsSection = () => {
    return (
      <div className="overview-section">
        <img className="image" src={require("../images/charts-graphs-image.png")} alt="Charts Graphs"/>
        <div className="text">
          <h2 className="title">Charts/Graphs</h2>
          <div className="description">Our charts/graphs offer additional information on crashes involved in NYC. There are two sections labeled as Recent Ten Years and Compare Two Years</div>
          <div className="spacing">The charts/graphs from the Recent Ten Years section offers visual information on all the crashes that occured within the last 10 years, excluding the current year. Everytime a new year starts, the site will automatically add new data from the previous year onto to the charts/graphs</div>
          <div className="spacing">The charts/graphs from the Compare Two Years section provides visual information on the crashes between two years that the user would like to compare. Again, everytime a new year starts, the site will automatically add new data from the previous year as an option to compare</div>
        </div>
      </div>
    )
  }

  // section for our limitations
  const LimitationsSection = () => {
    return  (
      <div className="overview-section">
        <img className="image" src={require("../images/limitations-image.png")} alt="Man Pushing Boulder"/>
        <div className="text">
          <h2 className="title">Limitations</h2>
          <ul>
            <li className="limitations-description">
              Dataset had many rows of crashes that didn't contain a latitude/longitude. As a result, we cannot utilize these rows as markers in our map. This means that our maps doesn't cover all the crashes that occured in the month because some data may be missing.
            </li>
            <li className="limitations-description"> 
              Our Predicted Severities map requires a latitude and longitude as coordinates for searching a location because we currently lack the ability to convert a real street address into their corresponding latitude/longitude coordinates for our map. 
            </li>
            <li className="limitations-description">
              We tried to include a whole year's worth of crashes onto our Recorded Crashes map so that there is more visual data for the user but the enormous amount of data caused our site to become very slow and unresponsive.
            </li>
            <li className="limitations-description">
              Although the dataset updates new crashes regularly, it is not technically up to date. The latest crashes listed in the dataset is approximately 3 days prior to the current date which means it is impossible to record real-time crashes, which was something we considered incorporating.
            </li>
          </ul>
        </div>
      </div>
    )
  }
  
  return (
    <section className="overview-container" id="overview">
      <h1 className="overview-title">Overview<div className="horizontal-line"></div></h1>
        <OverviewNavigation />
        {section === "goals" && <GoalsSection />}
        {section === "data-filtering" && <DataFilteringSection />}
        {section === "maps" && <OurMapsSection />}
        {section === "charts" && <ChartsSection />}
        {section === "limitations" && <LimitationsSection />}

        <div className="dataset-section">
          <h2 className="title">Dataset Used</h2>
          <a href="https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95/about_data" target="_blank" rel="noreferrer"><img className="dataset-logo" src={require("../images/open-data logo.png")} alt="LinkedIn logo"/></a>
          <div className="description">The Motor Vehicle Collisions dataset from NYC Open Data is free to use and contains information regarding all police reported motor vehicle collisions in NYC.</div>
        </div>
    </section>
  )
}