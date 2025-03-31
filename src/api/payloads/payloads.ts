export interface InitiateRecordPayload {
  user_id: string;
  recording_params: {
    resolution: string;
    frame_rate: string;
  };
}

export interface ApplyZoomPayload {
  input_video: string;
  start_time: number;
  end_time: number;
  zoom_factor: number;
  roi: [number, number, number, number];
}

export interface UploadVideoPayload {
  user_id?: string;
  file: File;
}

export interface translateScriptPayload {
  text: string;
  target_language: string;
}

export interface dubVideoPayload {
  upload_id: string;
  voice_params: {
    language: string;
    gender: "male" | "female";
  };
}

export interface addSubTitlePayload {
  upload_id: string;
  subtitles: [{ start: string; end: string; text: string }];
}

export interface mergeAudioPayload {
  batchid: string;
  video: string;
  voices: [{ audioid: string; audio: string; start_time: string; end_time: string }];
}

export interface mergeAudioResponse{
   status: string; token: string 
}

export interface mergeAudioProgressPayload{
    token: string;
}
export interface mergeAudioProgressResponse{ status: "Processing" | "Completed"; progress?: string; video_url?: string }

