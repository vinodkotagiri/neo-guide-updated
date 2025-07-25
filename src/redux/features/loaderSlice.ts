import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  loading: boolean;
  status?: string;
  percentage?: number;
  title?: string;
}

const initialState: LoaderState = {
  loading: false,
  status: "loading",
  percentage: 0,
  title:'',
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<LoaderState>) => {
      Object.assign(state, action.payload); // Correct state update
    },
    setLoaderData: (state, action: PayloadAction<Partial<LoaderState>>) => {
      if (action.payload.percentage !== undefined) {
        state.percentage = action.payload.percentage;
      }
      if (action.payload.status !== undefined) {
        state.status = action.payload.status;
      }
      if(action.payload.title !== undefined) {
        state.title = action.payload.title;
      }
    },
  },
});

export const { setLoader, setLoaderData } = loaderSlice.actions;
export default loaderSlice.reducer;
