import { createSlice } from "@reduxjs/toolkit";
// const DOCX_URL = "https://converter-effy.s3.amazonaws.com/session_5_20241228_122014/session_5_20241228_122014_Transcription_With_Clicks.docx";
// const DOCX_URL = "https://www.lehman.edu/faculty/john/classroomrespolicy1.docx";
interface articleState{
  articleData:Array<{text:string,image_url:string}>
}
const initialState:articleState={
  articleData: [

  ]
}
const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    setArticleData: (state, action) => {
      state.articleData = action.payload;
      window.localStorage.setItem('articleData',JSON.stringify(action.payload))
    }
  }
});
export const {setArticleData}=articleSlice.actions
export default articleSlice.reducer;
