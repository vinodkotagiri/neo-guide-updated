import { TimelineRow } from "@xzdarcy/react-timeline-editor";
//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
const url_test = "https://effybiz-devops.s3.ap-south-1.amazonaws.com/sample_video_2233.mp4";
interface SubtitlesState {
  data: [{ text: string; start: number; end: number }];
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
  subtitles: SubtitlesState;
  currentSubtitle: { text: string; start: number; end: number };
  tracks: TimelineRow[];
}
const initialSubtitleState: SubtitlesState = {
  data: [
    { start: "00:00:01", end: "00:00:20", text: "Welcome to the documentary." },
    { start: "00:00:21", end: "00:00:59", text: "In this episode, we explore the wonders of nature." },
    { start: "00:01:10", end: "00:02:14", text: "The forest is home to countless species of animals and plants." },
    { start: "00:02:15", end: "00:03:18", text: "Let's take a closer look at this ecosystem." },
    { start: "00:00:20", end: "00:00:24", text: "Deep in the jungle, we find the elusive jaguar." },
    { start: "00:00:25", end: "00:00:29", text: "It moves silently, blending into its surroundings." },
    { start: "00:00:30", end: "00:00:34", text: "Nearby, a group of monkeys chatter excitedly." },
    { start: "00:00:36", end: "00:00:40", text: "They swing effortlessly from branch to branch." },
    { start: "00:00:42", end: "00:00:47", text: "The rainforest is alive with sounds of birds and insects." },
    { start: "00:00:48", end: "00:00:52", text: "Each creature plays a vital role in the ecosystem." },
    { start: "00:00:54", end: "00:00:58", text: "Moving towards the river, we see crocodiles resting on the banks." },
    { start: "00:01:00", end: "00:01:04", text: "They lie still, waiting patiently for their prey." },
    { start: "00:01:06", end: "00:01:10", text: "The water is teeming with fish, providing food for many species." },
    { start: "00:01:12", end: "00:01:16", text: "As the sun sets, fireflies begin to glow in the darkness." },
    { start: "00:01:18", end: "00:01:22", text: "Their tiny lights dance like stars in the night." },
    { start: "00:01:24", end: "00:01:28", text: "This forest has existed for millions of years." },
    { start: "00:01:30", end: "00:01:35", text: "Its survival depends on our efforts to protect it." },
    { start: "00:01:37", end: "00:01:41", text: "Thank you for joining us on this journey." }
  ],
  color: "#fff",
  background: "#000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url: '',
  duration: 0,
  language: "",
  playing: false,
  played: 0,
  seeked: 0,
  isArticle: false,
  subtitles: initialSubtitleState,
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
    }
  }
});

export default videoSlice.reducer;
export const {
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
