import { createSlice } from "@reduxjs/toolkit";

const loaderSlice=createSlice({
  name:'loader',
  initialState:{
    loading:false,
    status:'loading',percentage:0,
  },
  reducers:{
    setLoader:(state,action)=>{
      state=action.payload
      return state
    }
  }
})

export const {setLoader}=loaderSlice.actions
export default loaderSlice.reducer