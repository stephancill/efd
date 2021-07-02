import React from "react"
import logo from "./../logo.svg"
import { User } from "./User"
import { SpinnerButton } from "./Spinner";

export function Nav({connectWallet, isConnectingWallet, canConnectWallet, currentUser, onSearchSubmit, onSearchChange, searchQuery, onSelectUser, displayedUser}) {
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
      <div style={{marginLeft: "auto", maxWidth: "var(--col-width)"}}>
        {currentUser ? 
        <User user={currentUser} onSelectUser={onSelectUser} displayedUser={displayedUser}></User> : 
        <SpinnerButton disabled={!canConnectWallet} className="actionButton" style={{width: "110px"}} isSpinning={isConnectingWallet} onClick={connectWallet}>Connect</SpinnerButton>}
      </div>
    </div>
    
  </nav>;
}