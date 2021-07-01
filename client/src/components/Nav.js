import React from "react"
import logo from "./../logo.svg"
import { User } from "./User"

export function Nav({connectWallet, currentUser, onSearchSubmit, onSearchChange, searchQuery, onSelectUser, displayedUser}) {
  return <nav>
    <div style={{textAlign: "left"}} className="navLogo">
      <a href="/"><img src={logo} alt="EFD" /></a>
    </div>

    <div style={{textAlign: "center"}} className="search">
      <form onSubmit={onSearchSubmit}>
        <input placeholder="Search address/ENS" value={searchQuery} onChange={onSearchChange}></input>
      </form>
    </div>

    <div className="userItemContainer">
    {
      currentUser ?
      <div style={{marginLeft: "auto", maxWidth: "var(--col-width)"}}>
          <User user={currentUser} onSelectUser={onSelectUser} displayedUser={displayedUser}></User>
      </div> :
      <div style={{textAlign: "right"}} className="connectButton">
        <button onClick={connectWallet}>Connect</button>
      </div>
    }
    </div>
    
  </nav>;
}