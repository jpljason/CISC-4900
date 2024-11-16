import React, { useState, useEffect } from "react";
import "../styles/overview.css"

export default function Overview() {
  return (
    <section className="overview-container" id="overview">
      <h1 className="overview-title">Overview<div className="horizontal-line"></div></h1>
        <h2 className="title">Data Filtering</h2>
        <div>
          The Motor Vehicles Collisions dataset isn't necessarily perfect. For example, rows had to be filtered out that aren't located in NYC bounds. Additionally, some rows had invalid latitudes/longitudes listed as 0.000000 which we filtered out as well.
        </div>
        <h2 className="title">Our Maps</h2>
        <div>We created two different maps for the user to interact with, the Predicted Severities map and the Recorded Crashes map. 
          <div className="map-section">The Predicted Severities map offers information and predictions on the crashes of a specific location inserted by the user. Location is based on latitude/longitude and these two values must be contained inside the Motor Vehicle Collisions dataset. If the user enters a valid NYC location that isn't within the dataset, the option to go to the nearest location is offered. The two predictions offered include likelihood of injury in a crash and likelihood of death in a crash. This is calculated by analyzing the total number of crashes that have at least 1 injury or death and comparing it to the total number of crashes that occured in that location. All the data regarding the specific location is based on the most recent update offered by the dataset.</div>
          <div className="map-section">The Recorded Crashes map offers details on all the crashes recorded since the previous month. It is separated by three color markers, green, yellow and red. Green indicates that the crash isn't considered threatening, there were no injuries/deaths recorded. Yellow indicates that the crash was mildly threatening, injuries were recorded but no deaths. Red indicates that the crash was severe to the point where deaths were recorded. Details such as borough and street names are only included if it is offered in the dataset, otherwise it is excluded. The data is updated on the fifth day of each month.</div>
        </div>
        <h2 className="title">Charts/Graphs</h2>
        <div>Our charts/graphs offer additional data </div>
        <h2 className="title">Limitations</h2>
        <div>
          - Dataset had many rows that didn't contain a latitude/longitude. As a result, we cannot utilize these rows for the data in our map. This means that our maps aren't necesesarily accurate because some data is excluded.
        </div>
        <div className="dataset-section">
          <h2 className="title">Dataset Used</h2>
          <a href="https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95/about_data" target="_blank"><img className="dataset-logo" src={require("../images/open-data logo.png")} alt="LinkedIn logo"/></a>
          <div className="dataset-desc">The Motor Vehicle Collisions dataset from NYC Open Data is free to use and access and contains information regarding all police reported motor vehicle collisions in NYC.</div>
        </div>
    </section>
  )
}