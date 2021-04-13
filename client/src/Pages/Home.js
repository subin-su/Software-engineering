import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../Pages/aa.jpg"




function logo() {
  return (
  <div className="logo">
    <img src={logo1}/>
    <a
              href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public"
              target="_blank"
              rel="noreferrer"
            >
             See how to protect yourself from coronaa
              </a>
  </div>
      
  
  );
  }

export default logo;
