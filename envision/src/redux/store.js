// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Update the path accordingly

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
