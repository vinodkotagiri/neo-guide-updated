export interface InitiateRecordResponse{
  recording_id: string;
  status:string;
}

export interface UploadVideoResponse{
  // upload_id: string;
  file_url:string;
}

export interface getTranscriptResponse{
  transcription: string;
  editable:boolean;
}

export interface translateScriptResponse{
  translated_text: string;
}

export interface dubVideoResponse{
  dubbed_video_url:string;
}