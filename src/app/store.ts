import { configureStore } from "@reduxjs/toolkit";
import workingReducer from './features/workingSlice'
const store= configureStore({
  reducer: {
    working: workingReducer
  }
})
export default store
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
