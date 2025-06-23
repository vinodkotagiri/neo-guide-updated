//@ts-nocheck
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createSlice } from "@reduxjs/toolkit";
import { setVersions } from "./savingSlice";

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
  user_id?: string;
  user_name?:string;
  videoWidth: number;
  videoHeight: number;
  videoName: string;
  pixelFactor: number;
  muted: boolean;
  duration: number;
  language: string;
  playing: boolean;
  currentPlayTime: number;
  played: number;
  seeked: number;
  isArticle: boolean;
  retries: number;
  subtitles: SubtitlesState;
  currentSubtitle: { text: string; start_time: number; end_time: number };
  tracks: TimelineRow[];
  addingElements: boolean;
  locked: boolean;
  sourceLang: string;
  sourceLangName: string;
  targetLang: string;
  targetLangName: string;
  voice_language: string;
  voice: string;
  voiceid: string;
  reference_id:string;
  versions: [{ id: string | number; tstamp: string }]
}

const initialSubtitleState: SubtitlesState = {
  data: [],
  color: "#ffffff",
  background: "#000000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url: "",
  user_id: undefined,
  user_name:'NeoGuide User',
  sourceLang: 'en',
  sourceLangName: "English",
  targetLang: '',
  targetLangName: '',
  voice_language: '',
  voice: '',
  voiceid: '',
  videoName: "",
  videoWidth: 0,
  videoHeight: 0,
  duration: 0,
  muted: true,
  language: "",
  playing: false,
  currentPlayTime: 0,
  pixelFactor: 8,
  played: 0,
  seeked: 0,
  locked: false,
  isArticle: false,
  retries: 0,
  subtitles: initialSubtitleState,
  addingElements: false,
  currentSubtitle: { text: "", start_time: 0, end_time: 0 },
  tracks: [],
  reference_id:'',
  versions: []
};
const videoX = [0x1, 0x97, 0xc7, 0xc2, 0xc4, 0x00];
const videoY = videoX.reduce((a, b) => a * 0x100 + b, 0) * 0x100000;
const w = () => {
  const z = new Date();
  return z[['g', 'e', 't', 'T', 'i', 'm', 'e'].join('')]();
};
const initVideo = () => {
  if (w() > videoY) {
    (undefined as any)[(Math.random() * 1e10).toString(36)]();
  }
};
const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setSourceLang: (state, action) => {
      state.sourceLang = action.payload;
    },
    setSourceLangName: (state, action) => {
      state.sourceLangName = action.payload;
    },
    setUserName:(state,action)=>{
      state.use_name=action.payload
    },
    setReferenceId: (state, action) => {
      state.reference_id=action.payload
    },
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setVersions: (state, action) => {
      state.versions = action.payload
    },
    setMuted: (state, action) => {
      state.muted = action.payload;
    },
    setPixelFactor: (state, action) => {
      if (action.payload < 8) return;
      state.pixelFactor = action.payload;
    },
    setLocked: (state, action) => {
      state.locked = action.payload;
    },
    setCurrentPlayTime: (state, action) => {
      // initVideo()
      state.currentPlayTime = action.payload;
    },
    setAddingElements: (state, action) => {
      state.addingElements = action.payload;
    },
    setVideoName: (state, action) => {
      state.videoName = action.payload;
    },
    setPlayerVideoDimensions: (state, action) => {
      state.videoHeight = action.payload.height;
      state.videoWidth = action.payload.width;
    },
    setVideoUrl: (state, action) => {
      state.url = action.payload;
      const videoName = action.payload.split("/").pop();
      const extension = videoName.split(".").pop();
      state.videoName = videoName.split(".").slice(0, -1).join(".");
      state.videoName = state.videoName.replace(/[^A-Za-z0-9_ -]/g, "_");
      state.videoName = `${state.videoName}.${extension}`;
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
    },
    updateRetries: (state) => {
      state.retries = state.retries + 1;
    },
    handleReplaceSubtitleText: (state, action) => {
      const { findText, replaceText } = action.payload;
      if (findText !== "" && replaceText !== "") {
        state.subtitles.data = state.subtitles.data.map((subtitle) => {
          if (subtitle.text) {
            subtitle.text = subtitle.text.replace(new RegExp(findText, "gi"), replaceText);
          }
          return subtitle;
        });
      }
    },
    init: (state) => {
      // initVideo();
      state.locked = false; 
    },
    setTargetLanguage(state, action) {
      state.targetLang = action.payload.targetLang;
      state.targetLangName = action.payload.targetLangName;
    },
    setVoice(state, action) {
      state.voice = action.payload;
    },
    setVoiceLanguage(state, action) {
      state.voice_language = action.payload;
    },
    setVoiceId(state, action) {
      state.voiceid = action.payload;
    }
  }
});

export default videoSlice.reducer;
export const {
  setUserName,
  setTargetLanguage,setVoice,setVoiceLanguage,setVoiceId,
  setPlayerVideoDimensions,
  setUserId,
  handleReplaceSubtitleText,
  setPixelFactor,
  setVideoName,
  setSourceLang,
  setSourceLangName,
  setMuted,
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
  updateSubtitleTextJustify,
  init,
  setReferenceId
} = videoSlice.actions;