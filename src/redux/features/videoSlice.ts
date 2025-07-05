//@ts-nocheck
import { TimelineRow } from "@xzdarcy/react-timeline-editor";
import { createSlice } from "@reduxjs/toolkit";

// const url_test2 = "https://effybiz-devops.s3.ap-south-1.amazonaws.com/sample_video_2233.mp4";
// const url_test2="https://effybiz-devops.s3.ap-south-1.amazonaws.com/The%2030-Second%20Video.mp4"
// const url_test2='https://effybiz-devops.s3.ap-south-1.amazonaws.com/output.mp4'
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
  isDisabled:boolean;
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
  
  data: [

        // {
        //   end_time: '00:00:03,000',
        //   start_time: '00:00:00,000',
        //   text: 'Hello, my name is Cristian and you are watching a Developer Story.'
        // },
        // {
        //   end_time: '00:00:06,000',
        //   start_time: '00:00:03,000',
        //   text: 'In this video, I\'m going to continue with the series on software architecture.'
        // },
        // {
        //   end_time: '00:00:10,000',
        //   start_time: '00:00:06,000',
        //   text: 'And if you haven\'t seen the earlier videos, I suggest you watch them first.'
        // },
        // {
        //   end_time: '00:00:15,000',
        //   start_time: '00:00:10,000',
        //   text: 'Just to summarize, we have expanded our system side by side and arranged it in layers.'
        // },
        // {
        //   end_time: '00:00:20,000',
        //   start_time: '00:00:15,000',
        //   text: 'Taking into account some limitations such as the CAP theorem.'
        // },
        // {
        //   end_time: '00:00:23,000',
        //   start_time: '00:00:20,000',
        //   text: 'With so many servers, we now have a bigger delay.'
        // },
        // {
        //   end_time: '00:00:28,000',
        //   start_time: '00:00:23,000',
        //   text: 'Even though we are now capable of managing millions of requests every second and millions of users.'
        // },
        // {
        //   end_time: '00:00:30,000',
        //   start_time: '00:00:28,000',
        //   text: 'How can we speed up the system?'
        // },
        // {
        //   end_time: '00:00:32,000',
        //   start_time: '00:00:30,000',
        //   text: 'One method is to use storage.'
        // },
        // {
        //   end_time: '00:00:37,000',
        //   start_time: '00:00:35,000',
        //   text: 'A cache is a part that keeps information.'
        // },
        // {
        //   end_time: '00:00:40,000',
        //   start_time: '00:00:37,000',
        //   text: 'So, upcoming requests asking for the same information can be provided more quickly.'
        // },
        // {
        //   end_time: '00:00:45,000',
        //   start_time: '00:00:43,000',
        //   text: 'We can have different tastes.'
        // },
        // {
        //   end_time: '00:00:48,000',
        //   start_time: '00:00:45,000',
        //   text: 'We can have a CDN, which means a network that delivers content.'
        // },
        // {
        //   end_time: '00:00:51,000',
        //   start_time: '00:00:48,000',
        //   text: 'This acts as a storage area for users so they don\'t have to download.'
        // },
        // {
        //   end_time: '00:00:54,000',
        //   start_time: '00:00:51,000',
        //   text: 'Every time, the same pictures or unchanging resources.'
        // },
        // {
        //   end_time: '00:00:56,000',
        //   start_time: '00:00:54,000',
        //   text: 'We can also have a storage or local memory.'
        // },
        // {
        //   end_time: '00:01:02,000',
        //   start_time: '00:00:56,000',
        //   text: 'You can add this feature to your service to enable faster responses to requests.'
        // },
        // {
        //   end_time: '00:01:06,000',
        //   start_time: '00:01:03,000',
        //   text: 'And you can also have additional features like spread-out storage.'
        // },
        // {
        //   end_time: '00:01:09,000',
        //   start_time: '00:01:06,000',
        //   text: 'similar to Redis or Memcache, where you can use it as a layer'
        // },
        // {
        //   end_time: '00:01:11,000',
        //   start_time: '00:01:09,000',
        //   text: 'For instance, before accessing the database.'
        // },
        // {
        //   end_time: '00:01:16,000',
        //   start_time: '00:01:13,000',
        //   text: 'Essentially, any level in the structure can have a storage cache.'
        // },
        // {
        //   end_time: '00:01:18,000',
        //   start_time: '00:01:16,000',
        //   text: 'Obviously, nothing is free.'
        // },
        // {
        //   end_time: '00:01:20,000',
        //   start_time: '00:01:18,000',
        //   text: 'Adding cache also makes our system more complex.'
        // },
        // {
        //   end_time: '00:01:23,000',
        //   start_time: '00:01:20,000',
        //   text: 'And cache can greatly enhance your system.'
        // },
        // {
        //   end_time: '00:01:25,000',
        //   start_time: '00:01:23,000',
        //   text: 'but can also lead to a lot of problems.'
        // },
        // {
        //   end_time: '00:01:27,000',
        //   start_time: '00:01:25,000',
        //   text: 'For instance, Phil Carton says'
        // },
        // {
        //   end_time: '00:01:36,000',
        //   start_time: '00:01:33,000',
        //   text: 'We are fully aware of the difficulty in naming things in computer science.'
        // },
        // {
        //   end_time: '00:01:38,000',
        //   start_time: '00:01:36,000',
        //   text: 'Clearing cache is even more complicated.'
        // },
        // {
        //   end_time: '00:01:40,000',
        //   start_time: '00:01:38,000',
        //   text: 'Some of the problems we might encounter with cache.'
        // },
        // {
        //   end_time: '00:01:42,000',
        //   start_time: '00:01:40,000',
        //   text: 'For instance, the delay in updating.'
        // },
        // {
        //   end_time: '00:01:45,000',
        //   start_time: '00:01:42,000',
        //   text: 'Let\'s imagine, for instance, that we are searching for an item.'
        // },
        // {
        //   end_time: '00:01:48,000',
        //   start_time: '00:01:45,000',
        //   text: 'Let\'s say we want to buy a new computer.'
        // },
        // {
        //   end_time: '00:01:50,000',
        //   start_time: '00:01:48,000',
        //   text: 'And the search results can be stored for later use.'
        // },
        // {
        //   end_time: '00:01:52,000',
        //   start_time: '00:01:50,000',
        //   text: 'So every time you search for a computer'
        // },
        // {
        //   end_time: '00:01:54,000',
        //   start_time: '00:01:52,000',
        //   text: 'There\'s no need to access the database.'
        // },
        // {
        //   end_time: '00:01:56,000',
        //   start_time: '00:01:54,000',
        //   text: 'So you receive a stored outcome.'
        // },
        // {
        //   end_time: '00:01:59,000',
        //   start_time: '00:01:56,000',
        //   text: 'But if we introduce a new product and the cache is not refreshed'
        // },
        // {
        //   end_time: '00:02:01,000',
        //   start_time: '00:01:59,000',
        //   text: 'then you might get old information.'
        // },
        // {
        //   end_time: '00:02:03,000',
        //   start_time: '00:02:01,000',
        //   text: 'Perhaps that product is not in stock.'
        // },
        // {
        //   end_time: '00:02:05,000',
        //   start_time: '00:02:03,000',
        //   text: 'Or perhaps you don\'t have a product that is available.'
        // },
        // {
        //   end_time: '00:02:08,000',
        //   start_time: '00:02:05,000',
        //   text: 'So you need to set up how fast or slow.'
        // },
        // {
        //   end_time: '00:02:10,000',
        //   start_time: '00:02:08,000',
        //   text: 'would be the clearing of the cache'
        // },
        // {
        //   end_time: '00:02:12,000',
        //   start_time: '00:02:10,000',
        //   text: 'Keeping those outcomes.'
        // },
        // {
        //   end_time: '00:02:16,000',
        //   start_time: '00:02:12,000',
        //   text: 'If it\'s too quick, it\'s pretty much like you had no memory storage.'
        // },
        // {
        //   end_time: '00:02:20,000',
        //   start_time: '00:02:16,000',
        //   text: 'But if it\'s too slow, then you may be displaying results that are not current.'
        // },
        // {
        //   end_time: '00:02:22,000',
        //   start_time: '00:02:20,000',
        //   text: 'You also have missed caches.'
        // },
        // {
        //   end_time: '00:02:25,000',
        //   start_time: '00:02:22,000',
        //   text: 'So, if you, for instance, have a load balancer.'
        // },
        // {
        //   end_time: '00:02:27,000',
        //   start_time: '00:02:25,000',
        //   text: 'Where are you redirecting the traffic to different servers?'
        // },
        // {
        //   end_time: '00:02:30,000',
        //   start_time: '00:02:27,000',
        //   text: 'If you have saved specific results on one server.'
        // },
        // {
        //   end_time: '00:02:32,000',
        //   start_time: '00:02:30,000',
        //   text: 'Let\'s talk about the customer\'s shopping cart.'
        // },
        // {
        //   end_time: '00:02:34,000',
        //   start_time: '00:02:32,000',
        //   text: 'If the user is then transferred to another server.'
        // },
        // {
        //   end_time: '00:02:37,000',
        //   start_time: '00:02:34,000',
        //   text: 'This second server won\'t have the cache card in it.'
        // },
        // {
        //   end_time: '00:02:39,000',
        //   start_time: '00:02:37,000',
        //   text: 'If it doesn\'t, then it needs to calculate again.'
        // },
        // {
        //   end_time: '00:02:41,000',
        //   start_time: '00:02:39,000',
        //   text: 'What is the current condition of the cart?'
        // },
        // {
        //   end_time: '00:02:42,000',
        //   start_time: '00:02:41,000',
        //   text: 'To save it in the memory storage.'
        // },
        // {
        //   end_time: '00:02:43,000',
        //   start_time: '00:02:42,000',
        //   text: 'And this can occur multiple times.'
        // },
        // {
        //   end_time: '00:02:45,000',
        //   start_time: '00:02:43,000',
        //   text: 'So if you keep changing from one server to another'
        // },
        // {
        //   end_time: '00:02:47,000',
        //   start_time: '00:02:45,000',
        //   text: 'then you will always be accessing an empty cache.'
        // },
        // {
        //   end_time: '00:02:49,000',
        //   start_time: '00:02:47,000',
        //   text: 'It\'s essentially the same as not having a cache.'
        // },
        // {
        //   end_time: '00:02:52,000',
        //   start_time: '00:02:50,000',
        //   text: 'Designing the cache will be quite difficult.'
        // },
        // {
        //   end_time: '00:02:55,000',
        //   start_time: '00:02:52,000',
        //   text: 'And if you have many levels of cache in different layers'
        // },
        // {
        //   end_time: '00:02:57,000',
        //   start_time: '00:02:55,000',
        //   text: 'It can become even more difficult.'
        // },
        // {
        //   end_time: '00:03:01,000',
        //   start_time: '00:02:59,000',
        //   text: 'Thanks to memory storage and ability to change size or scale.'
        // },
        // {
        //   end_time: '00:03:03,000',
        //   start_time: '00:03:01,000',
        //   text: 'Now millions of users can visit our online shopping site.'
        // },
        // {
        //   end_time: '00:03:05,000',
        //   start_time: '00:03:03,000',
        //   text: 'and receive quick replies.'
        // },
        // {
        //   end_time: '00:03:07,000',
        //   start_time: '00:03:05,000',
        //   text: 'Cache is something that can be added later.'
        // },
        // {
        //   end_time: '00:03:09,000',
        //   start_time: '00:03:07,000',
        //   text: 'It\'s not very important to understand it at the start.'
        // },
        // {
        //   end_time: '00:03:11,000',
        //   start_time: '00:03:09,000',
        //   text: 'because it\'s mainly a method to make things more efficient.'
        // },
        // {
        //   end_time: '00:03:15,000',
        //   start_time: '00:03:11,000',
        //   text: 'However, we need to consider it in the design.'
        // },
        // {
        //   end_time: '00:03:16,000',
        //   start_time: '00:03:15,000',
        //   text: 'but as we said earlier'
        // },
        // {
        //   end_time: '00:03:18,000',
        //   start_time: '00:03:16,000',
        //   text: 'It\'s something you can handle step by step.'
        // },
        // {
        //   end_time: '00:03:20,000',
        //   start_time: '00:03:18,000',
        //   text: 'and change the structure as needed.'
        // },
        // {
        //   end_time: '00:03:22,000',
        //   start_time: '00:03:20,000',
        //   text: 'So first we made it easy to maintain.'
        // },
        // {
        //   end_time: '00:03:24,000',
        //   start_time: '00:03:22,000',
        //   text: 'Then adjustable, then efficiency.'
        // },
        // {
        //   end_time: '00:03:26,000',
        //   start_time: '00:03:24,000',
        //   text: 'What else can we do to get better?'
        // },
        // {
        //   end_time: '00:03:29,000',
        //   start_time: '00:03:26,000',
        //   text: 'How well does the system perform, how easy is it to maintain, and how well can it handle growth?'
        // },
        // {
        //   end_time: '00:03:32,000',
        //   start_time: '00:03:29,000',
        //   text: 'Continue watching my series to learn more about them.'
        // },
        // {
        //   end_time: '00:03:33,000',
        //   start_time: '00:03:32,000',
        //   text: 'And that\'s all for today.'
        // },
        // {
        //   end_time: '00:03:34,000',
        //   start_time: '00:03:33,000',
        //   text: 'Thanks a lot for watching.'
        // },
        // {
        //   end_time: '00:03:35,000',
        //   start_time: '00:03:34,000',
        //   text: 'And if you enjoyed the video'
        // },
        // {
        //   end_time: '00:03:37,000',
        //   start_time: '00:03:35,000',
        //   text: 'Don\'t forget to hit the like button and subscribe.'
        // },
        // {
        //   end_time: '00:03:40,000',
        //   start_time: '00:03:37,000',
        //   text: 'Sure, you can share it with your friends.'
        // },
        // {
        //   end_time: '00:03:42,000',
        //   start_time: '00:03:40,000',
        //   text: 'And if you want to learn a little more'
        // },
        // {
        //   end_time: '00:03:43,000',
        //   start_time: '00:03:42,000',
        //   text: 'or do you believe I overlooked something?'
        // },
        // {
        //   end_time: '00:03:45,000',
        //   start_time: '00:03:43,000',
        //   text: 'Don\'t forget to leave them in the comments section below.'
        // },
        // {
        //   end_time: '00:03:47,000',
        //   start_time: '00:03:45,000',
        //   text: 'Thanks a lot and see you later.'
        // },
        // {
        //   end_time: '00:03:48,000',
        //   start_time: '00:03:47,000',
        //   text: 'Goodbye.'
        // }
    ],
  
  color: "#ffffff",
  background: "#000000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url: url_test2,
  isDisabled: false,
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
  versions: [
    // {
    //     "id": 31,
    //     "tstamp": "1750678424514"
    // },
    // {
    //     "id": 30,
    //     "tstamp": "1750678309548"
    // }
]
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
    },
    setDisabled:(state,action)=>{
      state.isDisabled=action.payload
    }
  }
});

export default videoSlice.reducer;
export const {
  setUserName,
  setDisabled,
  setTargetLanguage,setVoice,setVoiceLanguage,setVoiceId,
  setPlayerVideoDimensions,
  setUserId,
  setVersions,
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