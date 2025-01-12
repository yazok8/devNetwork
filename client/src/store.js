import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';
import setAuthToken from './utils/setauthtoken';

let currentState;

// 1) Create the store using configureStore
const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit has thunk by default. If you want to add more middleware, do:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourCustomMiddleware)
});

// 2) Keep the subscription logic if you want to track token changes
currentState = store.getState();

store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();

  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
