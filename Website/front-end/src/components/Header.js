import React, { useState, useEffect } from "react";
import '../styles/header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50){
        setIsScrolled(true)
      }
      else{
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-box">
        <a className="home-logo" href="#home-page"><img className="logo" src={require("../images/wrecked.png")}  /></a>
        <div className="header-title">NYC Road Risk Predictor</div>
        <navbar className="navbar"> 
          <a className="overview" href="#overview">Overview</a>
          <a className="evaluation" href="#evaluation">Evaluation</a>
          <a className="about_me" href="#about">Our Team</a>
        </navbar>
      </div>
    </header>
  )
}