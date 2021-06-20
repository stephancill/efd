import React from "react"
import logo from "./logo.svg"

function Nav(props) {
  return <nav>
    <div style={{textAlign: "left"}} className="navLogo">
      <a href="/"><img src={logo} alt="EFD" /></a>
    </div>
    <div style={{textAlign: "center"}} className="search">
      <input placeholder="Search address/ENS"></input>
    </div>

    {
      props.currentUser ?
      <div style={{textAlign: "right"}} className="userItem">
        <div>{props.currentUser}</div>
      </div> :
      <div style={{textAlign: "right"}} className="connectButton">
        <button>Connect</button>
      </div>
      
    }
    
  </nav>;
}

export default Nav