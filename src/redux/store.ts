import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./features/loaderSlice";
import videoReducer from "./features/videoSlice";
import zoomReducer from './features/zoomSlice';
export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    video: videoReducer,
    zoom:zoomReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
