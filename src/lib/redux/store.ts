
import { configureStore } from '@reduxjs/toolkit';
import moderationReducer from './moderationSlice';

export const store = configureStore({
  reducer: {
    moderation: moderationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
