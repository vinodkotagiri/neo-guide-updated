import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define valid loader status values
export type LoaderStatus = 'idle' | 'loading' | 'error';

// Interface for loader state
export interface LoaderState {
  loading: boolean;
  status: LoaderStatus; // Made required for clarity
  percentage: number; // Made required with default 0
}

// Initial state with explicit defaults
const initialState: LoaderState = {
  loading: false,
  status: 'idle', // Changed to 'idle' for clarity
  percentage: 0,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    // Set the entire loader state
    setLoader: (state, action: PayloadAction<LoaderState>) => {
      const { loading, status, percentage } = action.payload;
      // Validate percentage
      state.loading = loading;
      state.status = status;
      state.percentage = Math.max(0, Math.min(100, percentage)); // Clamp to 0-100
    },
    // Update specific loader fields
    setLoaderData: (state, action: PayloadAction<Partial<LoaderState>>) => {
      // Merge with validation
      if (action.payload.loading !== undefined) {
        state.loading = action.payload.loading;
      }
      if (action.payload.status !== undefined) {
        state.status = action.payload.status;
      }
      if (action.payload.percentage !== undefined) {
        state.percentage = Math.max(0, Math.min(100, action.payload.percentage)); // Clamp to 0-100
      }
    },
  },
});

// Export actions and reducer
export const { setLoader, setLoaderData } = loaderSlice.actions;
export default loaderSlice.reducer;