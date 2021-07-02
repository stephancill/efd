import React from "react"
import "./Spinner.css"

export function SpinnerButton({isSpinning=false, spinnerStyle={}, ...props}) {
  // TODO: Show transaction hash + link to explorer
  return <button {...props}>
    {isSpinning ? <div spinnerStyle={spinnerStyle} className="spinner" style={{borderColor: "rgba(255, 255, 255, 0.2)"}}></div> : props.children}
  </button>
   
}