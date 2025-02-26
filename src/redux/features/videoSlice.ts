//@ts-nocheck
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createSlice } from "@reduxjs/toolkit";
// const url_test = "https://effybiz-devops.s3.ap-south-1.amazonaws.com/sample_video_2233.mp4";
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
  currentPlayTime:number;
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
    // { start_time: "00:00:01", end_time: "00:00:20", text: "Welcome to the documentary." },
    // { start_time: "00:00:21", end_time: "00:00:59", text: "In this episode, we explore the wonders of nature." },
    // { start_time: "00:01:10", end_time: "00:02:14", text: "The forest is home to countless species of animals and plants." },
    // { start_time: "00:02:15", end_time: "00:03:18", text: "Let's take a closer look at this ecosystem." },
    // { start_time: "00:00:20", end_time: "00:00:24", text: "Deep in the jungle, we find the elusive jaguar." },
    // { start_time: "00:00:25", end_time: "00:00:29", text: "It moves silently, blending into its surroundings." },
    // { start_time: "00:00:30", end_time: "00:00:34", text: "Nearby, a group of monkeys chatter excitedly." },
    // { start_time: "00:00:36", end_time: "00:00:40", text: "They swing effortlessly from branch to branch." },
    // { start_time: "00:00:42", end_time: "00:00:47", text: "The rainforest is alive with sounds of birds and insects." },
    // { start_time: "00:00:48", end_time: "00:00:52", text: "Each creature plays a vital role in the ecosystem." },
    // { start_time: "00:00:54", end_time: "00:00:58", text: "Moving towards the river, we see crocodiles resting on the banks." },
    // { start_time: "00:01:00", end_time: "00:01:04", text: "They lie still, waiting patiently for their prey." },
    // { start_time: "00:01:06", end_time: "00:01:10", text: "The water is teeming with fish, providing food for many species." },
    // { start_time: "00:01:12", end_time: "00:01:16", text: "As the sun sets, fireflies begin to glow in the darkness." },
    // { start_time: "00:01:18", end_time: "00:01:22", text: "Their tiny lights dance like stars in the night." },
    // { start_time: "00:01:24", end_time: "00:01:28", text: "This forest has existed for millions of years." },
    // { start_time: "00:01:30", end_time: "00:01:35", text: "Its survival depends on our efforts to protect it." },
    // { start_time: "00:01:37", end_time: "00:01:41", text: "Thank you for joining us on this journey." }

  ],
  color: "#fff",
  background: "#000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url:'' ,
  duration: 0,
  language: "",
  playing: false,
  currentPlayTime:0,
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
    setCurrentPlayTime:(state,action)=>{
      state.currentPlayTime=action.payload
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
  setCurrentPlayTime,
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
