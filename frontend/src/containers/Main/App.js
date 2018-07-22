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
import { AuthService } from '../../Components/AuthService';
const Auth = new AuthService();

class App extends Component {
  constructor(props){
    super(props);

    this.loginHook = this.loginHook.bind(this);
  }
  
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route path="/" name="Home" component={this.loginHook} />
        </Switch>
      </HashRouter>
    );
  }

  loginHook(routerProps){
    if(!Auth.isLoggedIn() )
      return <Redirect to="/login" />
    return <DefaultLayout {...routerProps}/>
  }
}

export default App;
