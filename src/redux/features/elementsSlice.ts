import { createSlice } from "@reduxjs/toolkit";

export interface RectangleElementState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  cornerRadius: Array<number>;
  startTime: number;
  endTime: number;
}


export interface BlurElementState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  blurRadius: number;
  startTime: number;
  endTime: number;
}

interface ElementsState {
  currentElementId:string|null;
  currentElement: "rectangle" | "arrow" | "blur" | "text" | "spotlight" | "pop-over" | null;
  rectangles: RectangleElementState[];
  arrows: RectangleElementState[];
  blurs: BlurElementState[];
  texts: RectangleElementState[];
  spotLights: RectangleElementState[];
}
const INITIAL_STATE: ElementsState = {
  currentElementId:null,
  currentElement: null,
  rectangles: [],
  arrows: [],
  blurs: [],
  texts: [],
  spotLights: []
};

const elementsSlice = createSlice({
  name: "elements",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentElementId(state, action) {
      state.currentElementId = action.payload.id;
      state.currentElement = action.payload.type
    },
    setCurrentElement(state, action) {
      state.currentElement = action.payload;
      if(action.payload==null) state.currentElementId=null
    },
    addRectangle(state, action) {
      state.rectangles.push(action.payload);
      state.currentElementId = action.payload.id
    },
    addArrow(state, action) {
      state.arrows.push(action.payload);
    },
    addBlur(state, action) {
      state.blurs.push(action.payload);
      state.currentElementId = action.payload.id
    },
    addText(state, action) {
      state.texts.push(action.payload);
    },
    addSpotLight(state, action) {
      state.spotLights.push(action.payload);
    },
    editRectangle(state, action) {
      const index = state.rectangles.findIndex((e) => e.id === action.payload.id);
      const rect=state.rectangles[index]
      
      for(const key of Object.keys(rect)){
        if(action.payload[key]) rect[key]=action.payload[key]
      }
      state.rectangles[index] = rect
    },
    editArrow(state, action) {
      const index = state.arrows.findIndex((e) => e.id === action.payload.id);
      state.arrows[index] = action.payload;
    },
    editBlur(state, action) {
      console.log('acrionnn:',action.payload)
      const index = state.blurs.findIndex((e) => e.id === action.payload.id);
      const blur=state.blurs[index]
      for(const key of Object.keys(blur)){
        if(action.payload[key]) blur[key]=action.payload[key]
      }
      state.blurs[index] = blur
    },
    editText(state, action) {
      const index = state.text.findIndex((e) => e.id === action.payload.id);
      state.text[index] = action.payload;
    },
    editSpotLight(state, action) {
      const index = state.spotLights.findIndex((e) => e.id === action.payload.id);
      state.spotLights[index] = action.payload;
    },
    deleteRectangle(state, action) {
      state.rectangles = state.rectangles.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null
      state.currentElement = null
    },
    deleteArrow(state, action) {
      state.arrows = state.arrows.filter((e) => e.id !== action.payload);
    },
    deleteBlur(state, action) {
      state.blurs = state.blurs.filter((e) => e.id !== action.payload.id);
    },
    deleteText(state, action) {
      state.text = state.text.filter((e) => e.id !== action.payload);
    },
    deleteSpotLight(state, action) {
      state.spotLight = state.spotLight.filter((e) => e.id !== action.payload);
    },
  }
});

export default elementsSlice.reducer;
export const {
  setCurrentElementId,
  addRectangle,
  addArrow,
  addBlur,
  addText,
  addSpotLight,
  editRectangle,
  editArrow,
  editBlur,
  editText,
  editSpotLight,
  deleteRectangle,
  deleteArrow,
  deleteBlur,
  deleteText,
  deleteSpotLight,
  setCurrentElement,
} = elementsSlice.actions;
