import React from "react";
import "../styles/footer.css";

export default function Footer() {

  return (
    <footer className="footer-container">
      <section className="footer">
        <p className="copyright">&#169; 2024 The Syntax Sorcerers</p>
        <a href="https://github.com/jpljason/CISC-4900" target="_blank" >
          <img className="links-logo" src={require("../images/github-mark-white.png")} alt="GitHub logo"/>
        </a>
      </section>
    </footer>
  )
}