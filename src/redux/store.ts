'use client';

import { configureStore } from '@reduxjs/toolkit';
import broadCastReducer from './slices/broadcastSlice';
import liveStreamReducer from './slices/liveStreamSlice';

export const store = configureStore({
  reducer: {
    livestreams: liveStreamReducer,
    broadcasts: broadCastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
