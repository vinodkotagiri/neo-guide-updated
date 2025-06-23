import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./features/loaderSlice";
import videoReducer from "./features/videoSlice";
import articleReducer from './features/articleSlice';
import elementsReducer from './features/elementsSlice';
import savingReducer from './features/savingSlice';
export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    video: videoReducer,
    article:articleReducer,
    elements:elementsReducer,
    saving:savingReducer
  },
  // devTools: import.meta.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
