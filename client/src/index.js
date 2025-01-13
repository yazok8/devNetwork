import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import setAuthToken from './utils/setauthtoken';
import { loadUser } from './actions/auth';
import store from './store';

if (localStorage.token) {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
