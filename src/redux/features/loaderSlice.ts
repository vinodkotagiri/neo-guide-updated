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
    hideLoader: (state) => {
      state.loading = false;
    },
    showLoader: (state) => {
      state.loading = true;
    },
    setLoaderData: (state, action: PayloadAction<Partial<LoaderState>>) => {
      if(action.payload.loading !== undefined) {
        state.loading = action.payload.loading;
      }
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

export const { setLoader, setLoaderData, showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
