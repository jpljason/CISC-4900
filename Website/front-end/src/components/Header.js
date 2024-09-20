import React from "react";
import '../styles/header.css';

export default function Header() {

  return (
    <header class="header">
      <div class="header-box">
        <img class="logo" src={require("../images/car-accident.png")}  /> 
        <navbar class="navbar"> 
          <a class="overview" href="#overview">Overview</a>
          <a class="evaluation" href="#evaluation">Evaluation</a>
          <a class="about_me" href="#about">About Us</a>
        </navbar>
      </div>
    </header>
  )
}