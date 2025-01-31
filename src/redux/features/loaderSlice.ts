import { createSlice } from "@reduxjs/toolkit";

const loaderSlice=createSlice({
  name:'loader',
  initialState:{
    loading:false,
    status:'loading',
    percentage:0,
  },
  reducers:{
    setLoader:(state,action)=>{
      state=action.payload
      return state
    },
    setLoaderData:(state,action)=>{
      if(action.payload.percentage!=undefined){state.percentage=action.payload.percentage}
      if(action.payload.status!=undefined){state.status=action.payload.status}
      return state
    }
  }
})

export const {setLoader,setLoaderData}=loaderSlice.actions
export default loaderSlice.reducer