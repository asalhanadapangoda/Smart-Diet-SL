import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dietReducer from '../features/diet/dietSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diet: dietReducer,
  },
});
