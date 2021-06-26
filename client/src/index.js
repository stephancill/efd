import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router"
import Dapp from "./components/Dapp";
import { createBrowserHistory } from 'history'

const newHistory = createBrowserHistory();
console.log(Dapp)

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <Router history={newHistory}>
      <Dapp.Dapp />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
