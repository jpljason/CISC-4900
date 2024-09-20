import React from "react";
import '../styles/about-us.css'

export default function AboutUs() {

  return (
    <section class="about-us-container"> 
      <h1 id="about">About Us</h1>
      <div class="image" >
        <img src={require("../images/car-accident.png")} />  
        <img src={require("../images/car-accident.png")} />
      </div>
      <div>Yo</div>
    </section>
  )
}