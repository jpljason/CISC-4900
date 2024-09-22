import React from "react";
import '../styles/about-us.css'
import about_data from "./about_data"

function AboutUsCards(props) {
  return (
    <section class="about-us-cards"> 
      <img className="pfp" src={require(`../images/${props.img}`)} />
      <h1 className="name">{props.name}</h1>  
      <div className="description">{props.description}</div>
      <div className="links">
        <a href={props.links.github} target="_blank" >
          <img className="links-logo" src={require("../images/github-mark.png")} />
        </a>
        <a href={props.links.linkedIn} target="_blank">
          <img class="links-logo" src={require("../images/LI-In-Bug.png")} />
        </a>
      </div>
    </section>
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
    <div>
      <hr></hr>
      <h1 className="about-title" id="about">Project Team</h1>
      <div className="about-us">
        {cards}
      </div>
    </div>
  );
}
