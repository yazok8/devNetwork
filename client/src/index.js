
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import store from './store';
import ErrorBoundary from './components/layout/ErrorBoundary';
import { Provider } from 'react-redux';

const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
  store.dispatch(loadUser());
}


ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);