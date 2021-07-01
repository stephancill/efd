import React from "react"
import "./Spinner.css"

export function SpinnerButton({isSpinning=false, spinnerStyle={}, ...props}) {
  // TODO: Show transaction hash + link to explorer
  return <button {...props}>
    {isSpinning ? <div spinnerStyle={spinnerStyle} className="spinner"></div> : props.children}
  </button>
   
}