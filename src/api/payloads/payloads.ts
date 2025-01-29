export interface InitiateRecordPayload{
  user_id:string;
  recording_params:{
    resolution:string;
    frame_rate:string;
  }
}

export interface ApplyZoomPayload{
  input_video: string;
  start_time: number;
  end_time: number;
  zoom_factor: number;
  roi: [number, number, number, number];
}

export interface UploadVideoPayload{
  user_id:string;
  file:File;
}

export interface translateScriptPayload{
  text:string;
  target_language:string;
}

export interface dubVideoPayload{
  upload_id:string;
  voice_params:{
    language:string;
    gender:'male'|'female';
  }
}

export interface addSubTitlePayload{
  upload_id:string;
  subtitles:[
    {start:string;end:string;text:string}
  ]
}