// client/src/utils/setauthToken.js

import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
