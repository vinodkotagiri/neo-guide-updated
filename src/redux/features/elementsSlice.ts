import { createSlice } from "@reduxjs/toolkit";

interface RectangleElementState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  cornerRadius: string;
  startTime: number;
  endTime: number;
}
interface ElementsState {
  currentElementId:string|null;
  currentElement: "rectangle" | "arrow" | "blur" | "text" | "spotlight" | "pop-over" | null;
  rectangles: RectangleElementState[];
  arrows: RectangleElementState[];
  blur: RectangleElementState[];
  text: RectangleElementState[];
  spotLight: RectangleElementState[];
}
const INITIAL_STATE: ElementsState = {
  currentElementId:null,
  currentElement: null,
  rectangles: [],
  arrows: [],
  blur: [],
  text: [],
  spotLight: []
};

const elementsSlice = createSlice({
  name: "elements",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentElementId(state, action) {
      state.currentElementId = action.payload;
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
      state.blur.push(action.payload);
    },
    addText(state, action) {
      state.text.push(action.payload);
    },
    addSpotLight(state, action) {
      state.spotLight.push(action.payload);
    },
    editRectangle(state, action) {
      const index = state.rectangles.findIndex((e) => e.id === action.payload.id);
      state.rectangles[index] = action.payload;
    },
    editArrow(state, action) {
      const index = state.arrows.findIndex((e) => e.id === action.payload.id);
      state.arrows[index] = action.payload;
    },
    editBlur(state, action) {
      const index = state.blur.findIndex((e) => e.id === action.payload.id);
      state.blur[index] = action.payload;
    },
    editText(state, action) {
      const index = state.text.findIndex((e) => e.id === action.payload.id);
      state.text[index] = action.payload;
    },
    editSpotLight(state, action) {
      const index = state.spotLight.findIndex((e) => e.id === action.payload.id);
      state.spotLight[index] = action.payload;
    },
    deleteRectangle(state, action) {
      state.rectangles = state.rectangles.filter((e) => e.id !== action.payload);
    },
    deleteArrow(state, action) {
      state.arrows = state.arrows.filter((e) => e.id !== action.payload);
    },
    deleteBlur(state, action) {
      state.blur = state.blur.filter((e) => e.id !== action.payload);
    },
    deleteText(state, action) {
      state.text = state.text.filter((e) => e.id !== action.payload);
    },
    deleteSpotLight(state, action) {
      state.spotLight = state.spotLight.filter((e) => e.id !== action.payload);
    }
  }
});

export default elementsSlice.reducer;
export const {
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
