import { Operation, WorkingState } from "@/lib/interfaces/states";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WorkingState = {
  isUploading: false,
  isRecording:false,
  activeMenuButton:null,
  present: null,
  past: [],
  future: []
};

const workingSlice = createSlice({
  name: "working",
  initialState,
  reducers: {
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording=action.payload
    },
    setActiveMenu:(state,action)=>{
      state.activeMenuButton=action.payload
    },

    addOperation: (state, action: PayloadAction<Omit<Operation, "id">>) => {
      if (state.present) {
        state.past.push(state.present);
      }
      state.present = {
        id: state.past.length + 1,
        ...action.payload
      };
      state.future = []; // Clear redo stack when a new operation is added
    },

    undoOperation: (state) => {
      if (state.past.length > 0) {
        const lastOperation = state.past.pop()!;
        if (state.present) {
          state.future.unshift(state.present);
        }
        state.present = lastOperation;
      }
    },

    redoOperation: (state) => {
      if (state.future.length > 0) {
        const nextOperation = state.future.shift()!;
        if (state.present) {
          state.past.push(state.present);
        }
        state.present = nextOperation;
      }
    },

    clearHistory: (state) => {
      state.past = [];
      state.present = null;
      state.future = [];
    }
  }
});

export const { setIsUploading,setIsRecording,setActiveMenu, addOperation, undoOperation, redoOperation, clearHistory } = workingSlice.actions;
export default workingSlice.reducer;
