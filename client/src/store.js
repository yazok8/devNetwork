import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';

// 1) Create the store using configureStore
const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    auth: {
      token: localStorage.getItem('token'),
      isAuthenticated: null,
      loading: true,
      user: null
    }
  }
});

// Subscribe to store changes to persist token
store.subscribe(() => {
  const state = store.getState();
  const token = state.auth.token;
  
  if (token) {
    localStorage.setItem('token', token);
  }
});

export default store;