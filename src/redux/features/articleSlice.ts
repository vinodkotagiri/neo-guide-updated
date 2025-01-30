import { createSlice } from "@reduxjs/toolkit";
// const DOCX_URL = "https://converter-effy.s3.amazonaws.com/session_5_20241228_122014/session_5_20241228_122014_Transcription_With_Clicks.docx"; 
const DOCX_URL='https://www.lehman.edu/faculty/john/classroomrespolicy1.docx'
const articleSlice=createSlice({
  name:'article',
  initialState:{
    url:DOCX_URL,
  },
  reducers:{
    
  }
})

export default articleSlice.reducer
