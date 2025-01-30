import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./features/loaderSlice";
import videoReducer from "./features/videoSlice";
import zoomReducer from './features/zoomSlice';
import articleReducer from './features/articleSlice';
export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    video: videoReducer,
    zoom:zoomReducer,
    article:articleReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
