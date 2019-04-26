import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import socketIOClient from "socket.io-client";
import "./header.css";

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <header>
        <nav>
          <ul className="NavClass">
            <li>
              <NavLink exact to="/">
                Background
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports"> Reports </NavLink>
            </li>
            <li>
              <NavLink to="/flightsimulator"> Flight Simulator </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export { Header };
