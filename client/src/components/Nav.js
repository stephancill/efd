import React from "react"
import logo from "./../logo.svg"
import logoDark from "./../logo-dark.svg"
import { User } from "./User"
import { SunIcon } from '@primer/octicons-react'
import { MoonIcon } from '@primer/octicons-react'
import { SpinnerButton } from "./Spinner";

export function Nav({connectWallet, isConnectingWallet, canConnectWallet, currentUser, onSearchSubmit, onSearchChange, searchQuery, onSelectUser, displayedUser, onToggleTheme, theme}) {
  return <nav>
    <div style={{textAlign: "left"}} className="navLogo">
      <a href="/"><img src={theme === "light" ? logo : logoDark} alt="EFD" /></a>
    </div>

    <div style={{textAlign: "center"}} className="search">
      <form onSubmit={onSearchSubmit}>
        <input placeholder="Search address/ENS" value={searchQuery} onChange={onSearchChange}></input>
      </form>
    </div>

    <div className="userItemContainer">
      <div style={{display: "flex",marginLeft: "auto", maxWidth: "var(--col-width)"}}>
        <button style={{marginRight: "10px"}} className="inviteButton" onClick={onToggleTheme}>  {theme === "light" ? <MoonIcon size={28}/> : <SunIcon size={28}/>} </button>
        {currentUser ? 
        <User user={currentUser} onSelectUser={onSelectUser} displayedUser={displayedUser}></User> : 
        <SpinnerButton disabled={!canConnectWallet} className="actionButton" style={{width: "110px"}} isSpinning={isConnectingWallet} onClick={connectWallet}>Connect</SpinnerButton>}
      </div>
    </div>
    
  </nav>;
}