//@ts-nocheck
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createSlice } from "@reduxjs/toolkit";
const url_test = "https://effybiz-devops.s3.ap-south-1.amazonaws.com/sample_video_2233.mp4";
interface SubtitlesState {
  data: [{ text: string; start_time: number; end_time: number }];
  color: string;
  background: string;
  font: string;
  fontSize: number;
  textJustify: string;
}
interface VideoState {
  url: string;
  duration: number;
  language: string;
  playing: boolean;
  played: number;
  seeked: number;
  isArticle: boolean;
  retries:0;
  subtitles: SubtitlesState;
  currentSubtitle: { text: string; start_time: number; end_time: number };
  tracks: TimelineRow[];
  addingElements:boolean;
  locked:boolean;
}
const initialSubtitleState: SubtitlesState = {
  data: [
   
  ],
  color: "#fff",
  background: "#000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url: url_test,
  duration: 0,
  language: "",
  playing: false,
  played: 0,
  seeked: 0,
  locked:false,
  isArticle: false,
  retries:0,
  subtitles: initialSubtitleState,
  addingElements:false,
  currentSubtitle: { text: "", start: 0, end: 0 },
  tracks: [
    {
      id: "main_track",
      actions: [
        {
          id: "action00",
          start: 0,
          end:  2,
          disable: true,
          movable: false,
          flexible: false,
          effectId:'0'
        },{
          id: "action00",
          start: 3,
          end:  6,
          disable: true,
          movable: false,
          flexible: false,
          effectId:'0'
        }
      ]
    },
    {
      id: "intro_track",
      actions: [
        {
          id: "action00",
          start: 0,
          end:  2,
          disable: false,
          movable: true,
          flexible: true,
          effectId:'0',
        }
      ]
    }
  ]
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setLocked:(state,action)=>{
      state.locked=action.payload
    },
    setAddingElements:(state,action)=>{
      state.addingElements=action.payload
    },
    setVideoUrl: (state, action) => {
      state.url = action.payload;
      window.localStorage.setItem("url", action.payload);
    },
    setVideoDuration: (state, action) => {
      state.duration = action.payload;
      // state.tracks[0].actions[0].end = action.payload
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
    updateSubtitleData: (state, action) => {
      state.subtitles.data = action.payload;
      window.localStorage.setItem('subtitles',JSON.stringify(action.payload))
    },
    updateSubtitleColor: (state, action) => {
      state.subtitles.color = action.payload;
    },
    updateSubtitleBackground: (state, action) => {
      state.subtitles.background = action.payload;
    },
    updateSubtitleFont: (state, action) => {
      state.subtitles.font = action.payload;
    },
    updateSubtitleFontSize: (state, action) => {
      state.subtitles.fontSize = action.payload;
    },
    updateSubtitleTextJustify: (state, action) => {
      state.subtitles.textJustify = action.payload;
    },
    setCurrentSubtitle: (state, action) => {
      state.currentSubtitle = action.payload;
    },
    updateRetries:(state)=>{
      state.retries=state.retries+1
    }
  }
});

export default videoSlice.reducer;
export const {
  setLocked,
  updateRetries,
  setAddingElements,
  setVideoUrl,
  setCurrentSubtitle,
  setVideoDuration,
  setVideoPlaying,
  setVideoPlayed,
  setSeekedSeconds,
  setIsArticle,
  updateSubtitleData,
  updateSubtitleColor,
  updateSubtitleBackground,
  updateSubtitleFont,
  updateSubtitleFontSize,
  updateSubtitleTextJustify
} = videoSlice.actions;
