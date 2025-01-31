//client/src/actions/auth.js

import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

//LOAD USER

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return dispatch({ type: AUTH_ERROR });
  }
  
  setAuthToken(token);
  
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

//REGISTER USER

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAILURE,
    });
  }
};

//LOGIN USER

export const login = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth', { email, password });
    
    if (res.data.token) {
      // Dispatch login success first
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      // Set token in axios and localStorage
      setAuthToken(res.data.token);
      
      // Then load user
      dispatch(loadUser());
    }
  } catch (err) {
    dispatch({ type: LOGIN_FAILURE });
  }
};


export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
