import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

/* Components */
import App from './components/App';
import NotFound from './components/NotFound';

/* Routes */
var routes = (
  <Router history={browserHistory} >
    <Route path="/" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));