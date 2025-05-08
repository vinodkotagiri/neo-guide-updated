import { createSlice } from "@reduxjs/toolkit";

const savingSlice = createSlice({
  name: "saving",
  initialState: {
    isSaving: false,
    isSaved: false,
    subtitle:'',
    video:'',
    article:'',
    unique_id:'',
    userid:'',
    sourceLangName:'English',
    targetLang:'',
    targetLangName:'',
    voice_language:'',
    voice:'',
    voiceid:'',
    reference_id:'',
    projectname:'',
  },
  reducers: {
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setIsSaved: (state, action) => {
      state.isSaved = action.payload;
    },
  },
})

export const { setIsSaving, setIsSaved } = savingSlice.actions;
export default savingSlice.reducer;