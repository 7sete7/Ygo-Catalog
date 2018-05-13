import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Route, Redirect } from 'react-router-dom';
import './Main.css';

import Sidebar from '../../Components/SideBar';

import Home from '../../Views/Home';
import AboutUs from '../../Views/AboutUs';

class App extends Component {

  render() {
    return (
      <div className="app">
        <div className="app-body">
        <Sidebar />
          <main className="main">
            <Switch>
              <Route path="/home" name="Home" component={Home} />
              <Route path="/about-us" name="About Us" component={AboutUs} />
              <Redirect exact from="/" to="/home" />
            </Switch>
          </main>
        </div>
      </div>
    );
  }


}

export default App;
