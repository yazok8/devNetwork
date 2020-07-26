import axios from 'axios';
import setAlert from './alert';
import { GET_PROFILE, PROFILE_ERROR } from './types';

//get current users profile

export const getCurrentProfile = () => async (dispatch) => {
  try {
    //this route is from the back-end routes/apil files
    const res = await axios.getCurrentProfile('/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
