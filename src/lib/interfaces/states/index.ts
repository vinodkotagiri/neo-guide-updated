export interface Operation {
  id: number;
  type: string;
  value?: number;
}
export interface WorkingState {
  isUploading: boolean;
  isRecording: boolean;
  activeMenuButton: 'upload'|'record'|null;
  past: Array<Operation>;
  present: Operation | null;
  future: Array<Operation>;
}
