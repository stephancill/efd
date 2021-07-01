import React from "react"
import "./Spinner.css"

export function SpinnerButton({isSpinning=false, ...props}) {
  // TODO: Show transaction hash + link to explorer
  return <button {...props}>
    {isSpinning ? <div className="spinner"></div> : props.children}
  </button>
   
}