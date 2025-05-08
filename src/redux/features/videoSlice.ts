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
  videoWidth:number;
  videoHeight:number;
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
  retries: 0;
  subtitles: SubtitlesState;
  currentSubtitle: { text: string; start_time: number; end_time: number };
  tracks: TimelineRow[];
  addingElements: boolean;
  locked: boolean;
}
const initialSubtitleState: SubtitlesState = {
  data: [
    // {
    //   end_time: '00:00:03,000',
    //   start_time: '00:00:00,000',
    //   text: 'Hello, I\'m Cristian and you are watching a Developer\'s Story.'
    // },
    // {
    //   end_time: '00:00:06,000',
    //   start_time: '00:00:03,000',
    //   text: 'In this video, I will carry on with the series on software architecture.'
    // },
    // {
    //   end_time: '00:00:10,000',
    //   start_time: '00:00:06,000',
    //   text: 'And if you haven\'t seen the earlier videos, I suggest you watch them first.'
    // },
    // {
    //   end_time: '00:00:15,000',
    //   start_time: '00:00:10,000',
    //   text: 'So to recap, we have expanded our system side by side and set it up in layers.'
    // },
    // {
    //   end_time: '00:00:20,000',
    //   start_time: '00:00:15,000',
    //   text: 'Considering some restrictions such as the CAP theorem.'
    // },
    // {
    //   end_time: '00:00:23,000',
    //   start_time: '00:00:20,000',
    //   text: 'With so many servers, we now experience more delay.'
    // },
    // {
    //   end_time: '00:00:28,000',
    //   start_time: '00:00:23,000',
    //   text: 'Despite our ability to manage millions of requests per second and serve millions of users.'
    // },
    // {
    //   end_time: '00:00:30,000',
    //   start_time: '00:00:28,000',
    //   text: 'How can we speed up the system?'
    // },
    // {
    //   end_time: '00:00:32,000',
    //   start_time: '00:00:30,000',
    //   text: 'One method is to use memory storage.'
    // },
    // {
    //   end_time: '00:00:37,000',
    //   start_time: '00:00:35,000',
    //   text: 'A cache is a part that keeps information.'
    // },
    // {
    //   end_time: '00:00:40,000',
    //   start_time: '00:00:37,000',
    //   text: 'So, future requests asking for the same information can be provided more quickly.'
    // },
    // {
    //   end_time: '00:00:45,000',
    //   start_time: '00:00:43,000',
    //   text: 'We can have different tastes.'
    // },
    // {
    //   end_time: '00:00:48,000',
    //   start_time: '00:00:45,000',
    //   text: 'We can have a CDN, also known as a content delivery network.'
    // },
    // {
    //   end_time: '00:00:51,000',
    //   start_time: '00:00:48,000',
    //   text: 'That acts as a storage for the users so they don\'t have to download.'
    // },
    // {
    //   end_time: '00:00:54,000',
    //   start_time: '00:00:51,000',
    //   text: 'Each time the same pictures or the unchanging assets.'
    // },
    // {
    //   end_time: '00:00:56,000',
    //   start_time: '00:00:54,000',
    //   text: 'We can also have a storage or local backup.'
    // },
    // {
    //   end_time: '00:01:02,000',
    //   start_time: '00:00:56,000',
    //   text: 'That you can add to your service to respond more quickly to requests.'
    // },
    // {
    //   end_time: '00:01:06,000',
    //   start_time: '00:01:03,000',
    //   text: 'And you can also use other features like a shared cache.'
    // },
    // {
    //   end_time: '00:01:09,000',
    //   start_time: '00:01:06,000',
    //   text: 'Like Redis or Memcache, you can use it as a layer.'
    // },
    // {
    //   end_time: '00:01:11,000',
    //   start_time: '00:01:09,000',
    //   text: 'Before accessing the database, for instance.'
    // },
    // {
    //   end_time: '00:01:16,000',
    //   start_time: '00:01:13,000',
    //   text: 'Essentially, any level in the structure can have a cache.'
    // },
    // {
    //   end_time: '00:01:18,000',
    //   start_time: '00:01:16,000',
    //   text: 'Surely, nothing is free.'
    // },
    // {
    //   end_time: '00:01:20,000',
    //   start_time: '00:01:18,000',
    //   text: 'Adding cache also makes our system more complex.'
    // },
    // {
    //   end_time: '00:01:23,000',
    //   start_time: '00:01:20,000',
    //   text: 'And a cache can be something that significantly improves your system.'
    // },
    // {
    //   end_time: '00:01:25,000',
    //   start_time: '00:01:23,000',
    //   text: 'but it can also cause a lot of problems.'
    // },
    // {
    //   end_time: '00:01:27,000',
    //   start_time: '00:01:25,000',
    //   text: 'For instance, Phil Carton states'
    // },
    // {
    //   end_time: '00:01:36,000',
    //   start_time: '00:01:33,000',
    //   text: 'We already know how difficult it is to name things in computer science.'
    // },
    // {
    //   end_time: '00:01:38,000',
    //   start_time: '00:01:36,000',
    //   text: 'Clearing out old data is even more complicated.'
    // },
    // {
    //   end_time: '00:01:40,000',
    //   start_time: '00:01:38,000',
    //   text: 'Some problems we might face with cache'
    // },
    // {
    //   end_time: '00:01:42,000',
    //   start_time: '00:01:40,000',
    //   text: 'is, for instance, the delay in updates.'
    // },
    // {
    //   end_time: '00:01:45,000',
    //   start_time: '00:01:42,000',
    //   text: 'Let\'s assume, for instance, we are searching for a product.'
    // },
    // {
    //   end_time: '00:01:48,000',
    //   start_time: '00:01:45,000',
    //   text: 'Suppose we are planning to purchase a new computer.'
    // },
    // {
    //   end_time: '00:01:50,000',
    //   start_time: '00:01:48,000',
    //   text: 'And the search results can be saved for later use.'
    // },
    // {
    //   end_time: '00:01:52,000',
    //   start_time: '00:01:50,000',
    //   text: 'So every time you search for a computer.'
    // },
    // {
    //   end_time: '00:01:54,000',
    //   start_time: '00:01:52,000',
    //   text: 'You don\'t need to access the database.'
    // },
    // {
    //   end_time: '00:01:56,000',
    //   start_time: '00:01:54,000',
    //   text: 'So you receive a stored result.'
    // },
    // {
    //   end_time: '00:01:59,000',
    //   start_time: '00:01:56,000',
    //   text: 'But if we introduce a new product and the cache is not refreshed'
    // },
    // {
    //   end_time: '00:02:01,000',
    //   start_time: '00:01:59,000',
    //   text: 'then you may get results that are no longer current.'
    // },
    // {
    //   end_time: '00:02:03,000',
    //   start_time: '00:02:01,000',
    //   text: 'Perhaps that product is not in stock.'
    // },
    // {
    //   end_time: '00:02:05,000',
    //   start_time: '00:02:03,000',
    //   text: 'Or perhaps you are overlooking an available product.'
    // },
    // {
    //   end_time: '00:02:08,000',
    //   start_time: '00:02:05,000',
    //   text: 'So, you need to set how fast or slow.'
    // },
    // {
    //   end_time: '00:02:10,000',
    //   start_time: '00:02:08,000',
    //   text: 'would be clearing the cache'
    // },
    // {
    //   end_time: '00:02:12,000',
    //   start_time: '00:02:10,000',
    //   text: 'Saving those outcomes.'
    // },
    // {
    //   end_time: '00:02:16,000',
    //   start_time: '00:02:12,000',
    //   text: 'If it\'s too quick, it\'s like you don\'t have any back-up.'
    // },
    // {
    //   end_time: '00:02:20,000',
    //   start_time: '00:02:16,000',
    //   text: 'But if it\'s too slow, then you might be displaying results that are no longer current.'
    // },
    // {
    //   end_time: '00:02:22,000',
    //   start_time: '00:02:20,000',
    //   text: 'You also have issues with cache not being found.'
    // },
    // {
    //   end_time: '00:02:25,000',
    //   start_time: '00:02:22,000',
    //   text: 'So, for instance, if you have a load balancer.'
    // },
    // {
    //   end_time: '00:02:27,000',
    //   start_time: '00:02:25,000',
    //   text: 'Where are you diverting the traffic to various servers?'
    // },
    // {
    //   end_time: '00:02:30,000',
    //   start_time: '00:02:27,000',
    //   text: 'If you have saved some results in one server.'
    // },
    // {
    //   end_time: '00:02:32,000',
    //   start_time: '00:02:30,000',
    //   text: 'Let\'s say the user\'s shopping cart.'
    // },
    // {
    //   end_time: '00:02:34,000',
    //   start_time: '00:02:32,000',
    //   text: 'If the user is then transferred to another server.'
    // },
    // {
    //   end_time: '00:02:37,000',
    //   start_time: '00:02:34,000',
    //   text: 'This second server won\'t have the storage memory available.'
    // },
    // {
    //   end_time: '00:02:39,000',
    //   start_time: '00:02:37,000',
    //   text: 'If it doesn\'t, then it will need to do the calculation again.'
    // },
    // {
    //   end_time: '00:02:41,000',
    //   start_time: '00:02:39,000',
    //   text: 'What is the present condition of the cart?'
    // },
    // {
    //   end_time: '00:02:42,000',
    //   start_time: '00:02:41,000',
    //   text: 'to save it in the memory storage.'
    // },
    // {
    //   end_time: '00:02:43,000',
    //   start_time: '00:02:42,000',
    //   text: 'And this could occur many times.'
    // },
    // {
    //   end_time: '00:02:45,000',
    //   start_time: '00:02:43,000',
    //   text: 'So if you keep changing from one server to another'
    // },
    // {
    //   end_time: '00:02:47,000',
    //   start_time: '00:02:45,000',
    //   text: 'Then you will always be accessing an empty cache.'
    // },
    // {
    //   end_time: '00:02:49,000',
    //   start_time: '00:02:47,000',
    //   text: 'It simply means not having a cache.'
    // },
    // {
    //   end_time: '00:02:52,000',
    //   start_time: '00:02:50,000',
    //   text: 'Designing the cache will be really difficult.'
    // },
    // {
    //   end_time: '00:02:55,000',
    //   start_time: '00:02:52,000',
    //   text: 'And if you have several levels of storage in different layers.'
    // },
    // {
    //   end_time: '00:02:57,000',
    //   start_time: '00:02:55,000',
    //   text: 'It can become even more difficult.'
    // },
    // {
    //   end_time: '00:03:01,000',
    //   start_time: '00:02:59,000',
    //   text: 'Thanks to storage memory and ability to grow.'
    // },
    // {
    //   end_time: '00:03:03,000',
    //   start_time: '00:03:01,000',
    //   text: 'Now millions of people can use our online shopping site.'
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
    //   text: 'It\'s not really crucial to understand it at the start.'
    // },
    // {
    //   end_time: '00:03:11,000',
    //   start_time: '00:03:09,000',
    //   text: 'because it\'s mainly a method to improve efficiency.'
    // },
    // {
    //   end_time: '00:03:15,000',
    //   start_time: '00:03:11,000',
    //   text: 'However, we need to keep this in mind when designing the structure.'
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
    //   text: 'So first, we made it easy to maintain.'
    // },
    // {
    //   end_time: '00:03:24,000',
    //   start_time: '00:03:22,000',
    //   text: 'Then it can be scaled, then its performance.'
    // },
    // {
    //   end_time: '00:03:26,000',
    //   start_time: '00:03:24,000',
    //   text: 'What else can we do to get better?'
    // },
    // {
    //   end_time: '00:03:29,000',
    //   start_time: '00:03:26,000',
    //   text: 'How well does the system perform, how easy is it to maintain, and how much can it grow or expand?'
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
    //   text: 'Sure, you\'re welcome to share this with your friends.'
    // },
    // {
    //   end_time: '00:03:42,000',
    //   start_time: '00:03:40,000',
    //   text: 'And if you want to learn a bit more'
    // },
    // {
    //   end_time: '00:03:43,000',
    //   start_time: '00:03:42,000',
    //   text: 'Or do you believe I overlooked something?'
    // },
    // {
    //   end_time: '00:03:45,000',
    //   start_time: '00:03:43,000',
    //   text: 'Don\'t forget to leave them in the comments below.'
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
  color: "#fff",
  background: "#000",
  font: "Open Sans",
  fontSize: 12,
  textJustify: "center"
};

const initialState: VideoState = {
  url: url_test,
  videoName: "",
  videoWidth:0,
  videoHeight:0,
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
  currentSubtitle: { text: "", start: 0, end: 0 },
  tracks: [
  ]
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setMuted: (state, action) => {
      state.muted = action.payload;
    },
    setPixelFactor: (state, action) => {
      if (action.payload < 8) return;
      // if(state.pixelFactor<=0||state.pixelFactor>=12) return

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
    setPlayerVideoDimensions:(state,actions)=>{
      state.videoHeight=actions.payload.height
      state.videoWidth=actions.payload.width
    },
    setVideoUrl: (state, action) => {
      state.url = action.payload;
      const videoName = action.payload.split("/").pop(); // Get filename from path
      const extension = videoName.split(".").pop(); // Get file extension
      state.videoName = videoName.split(".").slice(0, -1).join("."); // Remove extension
      state.videoName = state.videoName.replace(/[^A-Za-z0-9_ -]/g, "_");
      state.videoName = `${state.videoName}.${extension}`; // Rebuild with extension
      // window.localStorage.setItem("url", action.payload);
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
      // window.localStorage.setItem("subtitles", JSON.stringify(action.payload));
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
    handleReplaceSubtitleText: (state,action) => {
      const {findText,replaceText}=action.payload
      if (findText != "" && replaceText != "") {
        state.subtitles.data = state.subtitles.data.map((subtitle) => {
          if (subtitle.text) {
            subtitle.text = subtitle.text.replace(new RegExp(findText, "gi"), replaceText);
          }
          return subtitle;
        });
      }
    }
  }
});

export default videoSlice.reducer;
export const {
  setPlayerVideoDimensions,
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
  updateSubtitleTextJustify
} = videoSlice.actions;
