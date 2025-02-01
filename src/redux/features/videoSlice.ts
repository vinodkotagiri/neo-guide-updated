import { createSlice } from "@reduxjs/toolkit";
// const url_test = "https://effybiz-devops.s3.ap-south-1.amazonaws.com/sample_video_2233.mp4";
interface VideoState {
  url: string;
  duration: number;
  language:string;
  playing: boolean;
  played: number;
  seeked: number;
  isArticle:boolean;
}

const initialState: VideoState = {
  url: '',
  duration: 0,
  language:'',
  playing: false,
  played: 0,
  seeked: 0,
  isArticle:false
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoUrl: (state, action) => {
      state.url = action.payload;
    },
    setVideoDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVideoPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setVideoPlayed: (state, action) => {
      state.played = action.payload;
    },
    setSeekedSeconds: (state, action) => {
      state.seeked = action.payload;
    },
    setIsArticle: (state, action) => {
      state.isArticle = action.payload;
    },
  }
});

export default videoSlice.reducer;
export const { setVideoUrl, setVideoDuration, setVideoPlaying, setVideoPlayed,setSeekedSeconds,setIsArticle } = videoSlice.actions;
