import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Homepage from './pages/Homepage';
import ControlPanel from './pages/ControlPanel';
import Heart from './pages/Heart';
import Data from './pages/Data';

class App extends Component {


  render() {
    return (
      <Router>
        <div>
          <ul className="d-flex flex-row nav-bar">
            <li className="p-3">
              <Link to="/">Home</Link>
            </li>
            <li className="p-3">
              <Link to="/data">Data</Link>
            </li>
          </ul>

          <hr />

          {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
          <Switch>
            <Route exact path="/">
              <Heart />
            </Route>
            <Route exact path="/heart">
              <Heart />
            </Route>
            <Route exact path="/data">
              <Data />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}




export default App;
