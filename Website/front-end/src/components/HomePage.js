import React from "react";
import "../styles/home-page.css";

export default function HomePage(){
  return (
    <div className="home-image" id="home-page">
      <div className="home-container">
        <div className="home-motto">
          Know the Risks Avoid the Crash
        </div>
        <a href="#overview"><button class="explore-button">Explore</button></a>
      </div>
    </div>
  )
}