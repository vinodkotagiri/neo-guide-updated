import { configureStore } from '@reduxjs/toolkit';

import articleReducer from './features/articleSlice';
import elementsReducer from './features/elementsSlice';
import loaderReducer from './features/loaderSlice';
import savingReducer from './features/savingSlice';
import videoReducer from './features/videoSlice';

export const store = configureStore({
  reducer: {
    article: articleReducer,
    elements: elementsReducer,
    loader: loaderReducer,
    saving: savingReducer,
    video: videoReducer,
  },
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;