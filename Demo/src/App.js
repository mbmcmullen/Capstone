import React, { Component } from "react";
import "./App.css";
import { Header } from "./global/header";
import { Switch, Route } from "react-router-dom";

import Reports from "./main/Reports";
import Background from "./main/Background";
import FlightSimulator from "./main/FlightSimulator";
import RealTimeChart from "./main/RealTimeChart"

/*The <Route> component is the main part of React Router. Anywhere that you want to only render content based on the location’s pathname, you should use a <Route> element. */

/* The Route component expects a path prop, which is a string that describes the pathname that the route matches */

/* The <Switch> will iterate over routes and only render the first one that matches the current pathname */

class App extends Component {
  constructor(){
    super()
  }
  render() {

    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Background} />
          <Route path="/reports" component={Reports} />  
          <Route path="/flightsimulator" component={FlightSimulator} />
        </Switch>
      </div>
    );
  }
}

export default App;
