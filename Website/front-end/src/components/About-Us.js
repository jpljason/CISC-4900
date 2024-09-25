import React from "react";
import '../styles/about-us.css'
import about_data from "./about_data"

function AboutUsCards(props) {
  return (
    <div class="about-us-cards"> 
      <img className="pfp" src={require(`../images/${props.img}`)} />
      <h1 className="name">{props.name}</h1>  
      <div className="description">{props.description}</div>
      <div className="links">
        <a href={props.links.github} target="_blank" >
          <img className="links-logo" src={require("../images/github-mark-white.png")} />
        </a>
        <a href={props.links.linkedIn} target="_blank">
          <img class="links-logo" src={require("../images/LI-In-Bug.png")} />
        </a>
      </div>
    </div>
  )
}

export default function AboutUs(){
  const cards = about_data.map(item => {
    console.log(item);
    return (
      <AboutUsCards
        key={item.id}
        {...item}
      />
    )
  })
  return (
    <section className="about-container" id="about">
      <h1 className="about-title"><div className="horizontal-line-left"></div>Meet Our Team<div className="horizontal-line-right"></div></h1>
      <div className="about-us">
        {cards}
      </div>
    </section>
  );
}
