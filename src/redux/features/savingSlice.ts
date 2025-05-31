import { createSlice } from "@reduxjs/toolkit";

const savingSlice = createSlice({
  name: "saving",
  initialState: {
   versions: []
  },
  reducers: {
   setVersions: (state, action) => {
    state.versions = action.payload
   }
  },
})

export const {setVersions} = savingSlice.actions;
export default savingSlice.reducer;