import { createSlice } from "@reduxjs/toolkit";
export interface zoomPayload {
  input_video: string;
  zoom_factor: number;
  roi: Array<number>;
  start_time: number;
  end_time: number;
  easing_factor: number;
}
interface zoomState {
  zooming: boolean;
  zoom_factor: number;
  roi: Array<number>;
  start_time: number;
  end_time: number;
  easing_factor: number;
  savedZooms: Array<zoomPayload> | [];
}
const initialState: zoomState = {
  zooming:false,
  zoom_factor: 1,
  roi: [0, 0, 0, 0],
  start_time: 0,
  end_time: 0,
  easing_factor: 2,
  savedZooms: [
    {
      input_video: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/output_videos/processed_video_Urdu.mp4",
      start_time: 30,
      end_time: 60,
      zoom_factor: 2,
      easing_factor: 2,
      roi: [100, 100, 300, 200]
    }
    // ,
    // {
    //   input_video: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/output_videos/processed_video_Urdu.mp4",
    //   start_time: 80,
    //   end_time: 100,
    //   zoom_factor: 1.5,
    //   easing_factor: 2,
    //   roi: [100, 100, 300, 200]
    // },
    // {
    //   input_video: "https://converter-effy.s3.ap-southeast-1.amazonaws.com/output_videos/processed_video_Urdu.mp4",
    //   start_time: 10,
    //   end_time: 15,
    //   zoom_factor: 2,
    //   easing_factor: 2,
    //   roi: [100, 100, 300, 200]
    // }
  ]
};
const zoomSlice = createSlice({
  name: "zoom",
  initialState,
  reducers: {
    setZooming: (state, action) => {
      state.zooming = action.payload;
    },
    setZoomFactor: (state, action) => {
      state.zoom_factor = action.payload;
    },
    setZoomROI: (state, action) => {
      state.roi = action.payload;
    },
    setZoomStartTime: (state, action) => {
      state.start_time = action.payload;
    },
    setZoomEndTime: (state, action) => {
      state.end_time = action.payload;
    },
    setZoomData: (state, action) => {
      const currentZooms = state.savedZooms;
      state.savedZooms = [...currentZooms, action.payload];
    },
    updateZoomData(state,action){
      const {start_time,end_time,index}=action.payload
      if(index!=undefined){
        if(start_time){
          state.savedZooms[index].start_time=start_time
        }
        if(end_time){
          state.savedZooms[index].end_time=end_time
        }
      }
    }
  }
});

export default zoomSlice.reducer;
export const { setZoomEndTime, setZoomFactor, setZoomROI, setZoomStartTime, setZoomData,updateZoomData, setZooming } = zoomSlice.actions;
