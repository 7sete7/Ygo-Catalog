import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

import '@coreui/icons/css/coreui-icons.min.css';
import 'flag-icon-css/css/flag-icon.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import '../../scss/style.css'


import DefaultLayout from '../DefaultLayout';
import { Login, Page404, Page500, Register } from '../../views';
import conf from '../../config';

// import { renderRoutes } from 'react-router-config';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" render={this.loginHook} />
        </Switch>
      </HashRouter>
    );
  }

  loginHook(){
    let location = window.location.hash;
    if(!conf.CACHE.get('userInfo') )
      return <Redirect exact from="/" to="/login" />
    return <DefaultLayout />
  }
}

export default App;
