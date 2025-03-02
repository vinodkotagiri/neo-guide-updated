//@ts-nocheck
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
  rotation: number;
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

export interface TextElementState {
  id: string;
  x: number;
  y: number;
  text: string;
  font: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  justify: string;
  startTime: number;
  endTime: number;
}

export interface ArrowElementState {
  id: string;
  x: number;
  y: number;
  points: Array<number>;
  stroke: string;
  strokeWidth: number;
  pointerLength: number;
  pointerWidth: number;
  rotation: number;
  startTime: number;
  endTime: number;
}

export interface SpotElementElementState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  glowColor: string;
  glowRadius: number;
  cornerRadius: Array<number>;
  startTime: number;
  endTime: number;
}

export interface ZoomElementState {
  id: string;
  zoom_factor: number;
  roi: {x:number;y:number;width:number;height:number};
  start_time: number;
  end_time: number;
  easing_factor: number;
}

interface ElementsState {
  currentElementId: string | null;
  currentElement: "rectangle" | "arrow" | "blur" | "text" | "spotlight" | "zoom" | null;
  rectangles: RectangleElementState[];
  arrows: ArrowElementState[];
  blurs: BlurElementState[];
  texts: TextElementState[];
  spotLights: SpotElementElementState[];
  zooms: ZoomElementState[]
}

const INITIAL_STATE: ElementsState = {
  currentElementId: null,
  currentElement: null,
  rectangles: [],
  arrows: [],
  blurs: [],
  texts: [],
  spotLights: [],
  zooms:[]
};

const elementsSlice = createSlice({
  name: "elements",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentElementId(state, action) {
      state.currentElementId = action.payload.id;
      state.currentElement = action.payload.type;
    },
    setCurrentElement(state, action) {
      state.currentElement = action.payload;
      if (action.payload == null) state.currentElementId = null;
    },
    addRectangle(state, action) {
      state.rectangles.push(action.payload);
      state.currentElementId = action.payload.id;
    },
    addZoom(state, action) {
      state.zooms.push(action.payload);
      state.currentElementId = action.payload.id;
    },
    addArrow(state, action) {
      state.arrows.push(action.payload);
      state.currentElementId = action.payload.id;
    },
    addBlur(state, action) {
      state.blurs.push(action.payload);
      state.currentElementId = action.payload.id;
    },
    addText(state, action) {
      state.texts.push(action.payload);
      state.currentElementId = action.payload.id;
      
    },
    addSpotLight(state, action) {
      state.spotLights.push(action.payload);
      state.currentElementId = action.payload.id;
    },
    editRectangle(state, action) {
      const index = state.rectangles.findIndex((e) => e.id === action.payload.id);
      const rect = state.rectangles[index];

      for (const key of Object.keys(rect)) {
        if (action.payload[key]) rect[key] = action.payload[key];
      }
      state.rectangles[index] = rect;
    },
    editZoom(state, action) {
      const index = state.zooms.findIndex((e) => e.id === action.payload.id);
      const rect = state.zooms[index];

      for (const key of Object.keys(rect)) {
        if (action.payload[key]) rect[key] = action.payload[key];
      }
      state.zooms[index] = rect;
    },
    editArrow(state, action) {
      const index = state.arrows.findIndex((e) => e.id === action.payload.id);
      const arrow = state.arrows[index];
      for (const key of Object.keys(arrow)) {
        if (action.payload[key]) arrow[key] = action.payload[key];
      }
      state.arrows[index] = arrow;
    },
    editBlur(state, action) {
      const index = state.blurs.findIndex((e) => e.id === action.payload.id);
      const blur = state.blurs[index];
      for (const key of Object.keys(blur)) {
        if (action.payload[key]) blur[key] = action.payload[key];
      }
      state.blurs[index] = blur;
    },
    editText(state, action) {
      const index = state.texts.findIndex((e) => e.id === action.payload.id);
      const text = state.texts[index];
      for (const key of Object.keys(text)) {
        if (action.payload[key]) text[key] = action.payload[key];
      }
      state.texts[index] = text;
    },
    editSpotLight(state, action) {
      const index = state.spotLights.findIndex((e) => e.id === action.payload.id);
      const spot = state.spotLights[index];
      for (const key of Object.keys(spot)) {
        if (action.payload[key]) spot[key] = action.payload[key];
      }
      state.spotLights[index] = spot;
    },
    deleteRectangle(state, action) {
      state.rectangles = state.rectangles.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null;
      state.currentElement = null;
    },
    deleteZoom(state, action) {
      state.zooms = state.zooms.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null;
      state.currentElement = null;
    },
    deleteArrow(state, action) {
      state.arrows = state.arrows.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null;
      state.currentElement = null;
    },
    deleteBlur(state, action) {
      state.blurs = state.blurs.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null;
      state.currentElement = null;
    },

    deleteText(state, action) {
      state.texts = state.texts.filter((e) => e.id !== action.payload.id);
      state.currentElementId = null;
      state.currentElement = null;
    },
    deleteSpotLight(state, action) {
      state.spotLights = state.spotLights.filter((e) => e.id !== action.payload.id);
    }
  }
});

export default elementsSlice.reducer;
export const {
  setCurrentElementId,
  addRectangle,
  addZoom,
  editZoom,
  deleteZoom,
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
  setCurrentElement
} = elementsSlice.actions;
