import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define subtitle data structure
export interface Subtitle {
  text: string;
  start_time: number;
  end_time: number;
}

// Define subtitles state
export interface SubtitlesState {
  data: Subtitle[];
  color: string;
  background: string;
  font: string;
  fontSize: number;
  textJustify: 'left' | 'center' | 'right';
}

// Define video state
export interface VideoState {
  url: string;
  user_id?: string;
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
  currentSubtitle: Subtitle;
  addingElements: boolean;
  locked: boolean;
  sourceLang: string;
  sourceLangName: string;
  targetLang: string;
  targetLangName: string;
  voice_language: string;
  voice: string;
  voiceid: string;
}

// Initial subtitles state
const initialSubtitleState: SubtitlesState = {
  data: [],
  color: '#ffffff',
  background: '#000000',
  font: 'Open Sans',
  fontSize: 12,
  textJustify: 'center',
};

// Initial video state
const initialState: VideoState = {
  url: '',
  user_id: undefined,
  sourceLang: 'en',
  sourceLangName: 'English',
  targetLang: '',
  targetLangName: '',
  voice_language: '',
  voice: '',
  voiceid: '',
  videoName: '',
  videoWidth: 0,
  videoHeight: 0,
  duration: 0,
  muted: true,
  language: '',
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
  currentSubtitle: { text: '', start_time: 0, end_time: 0 },
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | undefined>) => {
      state.user_id = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
    },
    setPixelFactor: (state, action: PayloadAction<number>) => {
      if (action.payload < 8) return;
      state.pixelFactor = action.payload;
    },
    setLocked: (state, action: PayloadAction<boolean>) => {
      state.locked = action.payload;
    },
    setCurrentPlayTime: (state, action: PayloadAction<number>) => {
      state.currentPlayTime = action.payload;
    },
    setAddingElements: (state, action: PayloadAction<boolean>) => {
      state.addingElements = action.payload;
    },
    setVideoName: (state, action: PayloadAction<string>) => {
      state.videoName = action.payload;
    },
    setPlayerVideoDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      state.videoWidth = action.payload.width;
      state.videoHeight = action.payload.height;
    },
    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
      const videoName = action.payload.split('/').pop() || '';
      const extension = videoName.split('.').pop() || '';
      const baseName = videoName.split('.').slice(0, -1).join('.');
      state.videoName = baseName
        ? `${baseName.replace(/[^A-Za-z0-9_ -]/g, '_')}.${extension}`
        : '';
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVideoPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setVideoPlayed: (state, action: PayloadAction<number>) => {
      state.played = action.payload;
    },
    setSeekedSeconds: (state, action: PayloadAction<number>) => {
      state.seeked = action.payload;
    },
    setIsArticle: (state, action: PayloadAction<boolean>) => {
      state.isArticle = action.payload;
    },
    updateSubtitleData: (state, action: PayloadAction<Subtitle[]>) => {
      state.subtitles.data = action.payload;
    },
    updateSubtitleColor: (state, action: PayloadAction<string>) => {
      state.subtitles.color = action.payload;
    },
    updateSubtitleBackground: (state, action: PayloadAction<string>) => {
      state.subtitles.background = action.payload;
    },
    updateSubtitleFont: (state, action: PayloadAction<string>) => {
      state.subtitles.font = action.payload;
    },
    updateSubtitleFontSize: (state, action: PayloadAction<number>) => {
      state.subtitles.fontSize = action.payload;
    },
    updateSubtitleTextJustify: (
      state,
      action: PayloadAction<'left' | 'center' | 'right'>,
    ) => {
      state.subtitles.textJustify = action.payload;
    },
    setCurrentSubtitle: (state, action: PayloadAction<Subtitle>) => {
      state.currentSubtitle = action.payload;
    },
    updateRetries: (state) => {
      state.retries += 1;
    },
    handleReplaceSubtitleText: (
      state,
      action: PayloadAction<{ findText: string; replaceText: string }>,
    ) => {
      const { findText, replaceText } = action.payload;
      if (findText && replaceText) {
        state.subtitles.data = state.subtitles.data.map((subtitle) => ({
          ...subtitle,
          text: subtitle.text.replace(new RegExp(findText, 'gi'), replaceText),
        }));
      }
    },
    init: (state) => {
      state.locked = false;
      state.retries = 0;
      state.playing = false;
      state.currentPlayTime = 0;
    },
    setTargetLanguage: (
      state,
      action: PayloadAction<{ targetLang: string; targetLangName: string }>,
    ) => {
      state.targetLang = action.payload.targetLang;
      state.targetLangName = action.payload.targetLangName;
    },
    setVoice: (state, action: PayloadAction<string>) => {
      state.voice = action.payload;
    },
    setVoiceLanguage: (state, action: PayloadAction<string>) => {
      state.voice_language = action.payload;
    },
    setVoiceId: (state, action: PayloadAction<string>) => {
      state.voiceid = action.payload;
    },
  },
});

export const {
  setTargetLanguage,
  setVoice,
  setVoiceLanguage,
  setVoiceId,
  setPlayerVideoDimensions,
  setUserId,
  handleReplaceSubtitleText,
  setPixelFactor,
  setVideoName,
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
} = videoSlice.actions;

export default videoSlice.reducer;