import { createSlice } from "@reduxjs/toolkit";
export interface zoomPayload {
  zoom_factor: number;
  roi: {x:number;y:number;width:number;height:number};
  start_time: number;
  end_time: number;
  easing_factor: number;
}
interface zoomState {
  zooming: boolean;
  zooms: Array<zoomPayload> | [];
}
const initialState: zoomState = {
  zooming:false,
  zooms: [
    {
      start_time: 10,
      end_time: 20,
      zoom_factor: 2,
      easing_factor: 0.5,
      roi: {x:100, y: 100, width:300, height:200}
    }
  ]
};
const zoomSlice = createSlice({
  name: "zoom",
  initialState,
  reducers: {
    setZooming: (state, action) => {
      state.zooming = action.payload;
    },
   
    setZoomData: (state, action) => {
      const currentZooms = state.zooms;
      state.zooms = [...currentZooms, action.payload];
    },
    updateZoomData(state,action){
      const {start_time,end_time,index}=action.payload
      if(index!=undefined){
        if(start_time){
          state.zooms[index].start_time=start_time
        }
        if(end_time){
          state.zooms[index].end_time=end_time
        }
      }
    }
  }
});

export default zoomSlice.reducer;
export const { setZoomData,updateZoomData, setZooming } = zoomSlice.actions;
