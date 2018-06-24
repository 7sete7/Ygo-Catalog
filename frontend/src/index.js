import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/Main';
// disable ServiceWorker
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// disable ServiceWorker
// registerServiceWorker();
