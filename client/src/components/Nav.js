import React from "react"
import logo from "./../logo.svg"

export function Nav({connectWallet, currentUser, onSearchSubmit, onSearchChange, searchQuery}) {
  return <nav>
    <div style={{textAlign: "left"}} className="navLogo">
      <a href="/"><img src={logo} alt="EFD" /></a>
    </div>

    <div style={{textAlign: "center"}} className="search">
      <form onSubmit={onSearchSubmit}>
        <input placeholder="Search address/ENS" value={searchQuery} onChange={onSearchChange}></input>
      </form>
    </div>

    {
      currentUser ?
      <div style={{textAlign: "right"}} className="userItem">
        <div>{currentUser.address}</div>
      </div> :
      <div style={{textAlign: "right"}} className="connectButton">
        <button onClick={connectWallet}>Connect</button>
      </div>
    }
  </nav>;
}