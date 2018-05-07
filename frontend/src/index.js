import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Main from './Container/Main';

ReactDOM.render((
  <HashRouter>
    <Switch>
      <Route path="/" component={Main} name="Home"/>
    </Switch>
  </HashRouter>
), document.getElementById('root'));
registerServiceWorker();
