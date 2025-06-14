//@ts-nocheck
import axios from "axios";
import { ApplyZoomPayload, mergeAudioPayload, mergeAudioProgressPayload, mergeAudioProgressResponse, mergeAudioResponse, UploadVideoPayload } from "./payloads/payloads";
import { UploadVideoResponse } from "./responses/responses";
import AWS from "aws-sdk";
import { getLanguages } from "../helpers";

const BASE_URL =
  import.meta.env.VITE_NODE_ENV == "local" ? "http://161.97.162.131:3000" : "https://docvideo.effybiz.com/api";
const api = axios.create({
  baseURL: BASE_URL
});

export async function uploadFile(payload: UploadVideoPayload): Promise<UploadVideoResponse | null> {
  try {
    AWS.config.update({
      region: import.meta.env.VITE_AWS_REGION as string,
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string
    });
    const s3 = new AWS.S3();
    const params = {
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET as string,
      Key: payload.file.name,
      Body: payload.file,
      ContentType: payload.file.type
    };
    
    let response;
    if (payload.file.type.includes ("video/mp4")) {
      response = await s3.upload(params).promise();
    } else {
      const formData = new FormData();
      formData.append("file", file);
      const { file } = payload;
      response = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
    }
    if (!response?.Location) return null;
    return { file_url: response.Location };
  } catch (error) {
    console.log("error uploading file:", error);
    return null;
  }
}

export async function getProgress(
  requestId: string
): Promise<{ progress: number; status: string; details?: string; result?: unknown } | null> {
  return new Promise((resolve) => {
    api
      .get(`http://158.220.94.84:3000/progress/${requestId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
        return null;
      });
  });
}

export async function applyZoom(payload: ApplyZoomPayload) {
  return new Promise((resolve) => {
    api
      .post("/zoom/apply-zoom", payload)
      .then((res) => {
        resolve(res.data?.message?.split(" ")[0]);
      })
      .catch((error) => {
        console.log("error applying zoom", error);
        resolve(null);
      });
  });
}

export async function translateAndDub(payload: {
  s3_link: string;
  target_language: string;
  voice: string;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("http://158.220.94.84:3000/dubbing", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

export async function getSubtitles(payload: {
  target_language: string;
  video_path: string;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("http://158.220.94.84:3000/subtitle", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

// ARTICLE
export async function createArticle(payload: { video_url: string }) {
  return new Promise((resolve) => {
    api
      .post("http://158.220.94.84:3000/article_formate", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

export async function enhanceAIArticle(payload: {
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/enhance_ai", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

export async function articleCreation(payload: {
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/article_creation", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

export async function articleLanguage(payload: {
  target_language: string;
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/article_lang", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error article_lang", error);
        resolve(null);
      });
  });
}

export async function conciseArticle(payload: {
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/article_concise", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error conciseArticle", error);
        resolve(null);
      });
  });
}

export async function articleStep(payload: {
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/article_step", payload)
      .then((res) => {
        console.log("res", res);
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error articleStep", error);
        resolve(null);
      });
  });
}

export async function rephraseArticle(payload: {
  json_content: Array<{ text?: string; image_url?: string }>;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/flsk/article_rephrase", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error article_rephrase", error);
        resolve(null);
      });
  });
}

export async function generateGIF(payload: {
  reference_image_url: string;
  video_url: string;
  gif_duration: number;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/gif/download-gif", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error generate-gif", error);
        resolve(null);
      });
  });
}

export async function getLanguages() {
  return new Promise((resolve) => {
    axios
      .get("https://contentinova.com/effybizgetlanguages")
      .then((res) => {
        if (res.data) {
          resolve(languages) 
        }
      })
      .catch((error) => {
        console.log("error getLanguages", error);
        resolve(null);
      });
  });
}

export async function getVoiceForLanguage(language_id: text) {
  return new Promise((resolve) => {
    axios
      .get(`https://contentinova.com/effybizgetvoices?language_id=${language_id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error getLanguages", error);
        resolve(null);
      });
  });
}

export async function textToSpeech(payload: { voiceid: string; text: string }): Promise<{ audio_url: string | null }> {
   return new Promise((resolve) => {
    axios
      .post("https://contentinova.com/data/effybizgeneratevoice", payload)
      .then((res) => {
        resolve(res?.data?.audio_url);
      })
      .catch((error) => {
        console.log("error getLanguages", error);
        resolve(null);
      });
  });
}

export async function mergeAudio(payload:mergeAudioPayload): Promise<mergeAudioResponse> {
  return new Promise((resolve) => {
    axios
      .post(" https://contentinova.com/mergeaudio", payload)
      .then((res) => {
        if(res.data.token){
          axios.post(" https://contentinova.com/mergeaudio_start", { token: res.data.token })
        }
        resolve(res.data)
      })
      .catch(() => resolve(null));
  });
}

export async function mergeAudioProgress(payload:mergeAudioProgressPayload): Promise<mergeAudioProgressResponse> {
  return new Promise((resolve) => {
    axios
      .post(" https://contentinova.com/mergeaudioprogress", payload)
      .then((res) =>{
        console.log('res.data',res.data)
        resolve(res.data)
      })
      .catch(() => resolve(null));
  });
}

export function exportVideo(payload){
 return new Promise(resolve=>{
  const url='https://contentinova.com/neoguideExport'
  axios.post(url,payload).then(res=>{
    if(res.data.status=="Success") {
      axios.post(url+'Start',{token:res.data.token})
      resolve(res.data.token)
    }
  }).catch((err)=>{
  console.log("error in export video",err)
  resolve( false)
  })
 })
}

export function trackExportProgress(token){
  return new Promise(resolve=>{
    const url='https://contentinova.com/neoguideExportProgress'
    axios.post(url,{token}).then(res=>resolve(res.data)).catch(err=>{
      console.log("error fetching export progress",err)
      resolve(false)
    })
  })
}
export function exportOrupdateJSON(payload:{json:Array<unknown>,action:"insert"|"update",filename?:string},file_name:string){
  if(file_name) payload.filename=file_name
  return new Promise(resolve=>{
    const url='https://contentinova.com/neoguidestorejson'
    axios.post(url,payload).then(res=>{
      if(res.data.filename){
        resolve(res.data)
      }else{
        resolve(false)
      }
    }).catch(err=>{
      console.log("error in export or update json",err)
      resolve(false)
    })
  })

}

export function exportOrupdateProject(payload){
  return new Promise(resolve=>{
    const url='https://contentinova.com/neoguideinsertdata'
    axios.post(url,payload).then(res=>{
      if(res.data.reference_id){
        resolve(res.data)
      }else{
        resolve(false)
      }
    }).catch(err=>{
      console.log("error in export or update json",err)
      resolve(false)
    })
  })
}

export function getProjectData(reference_id:{reference_id:string}){
  return new Promise(resolve=>{
    const url='https://contentinova.com/neoguidegetdata'
    axios.post(url,{reference_id}).then(res=>{
     return res.data
    }).catch(err=>{
      console.log("error in export or update json",err)
      resolve(false)
    })
  })
}

export function getVersions(){
  return new Promise(resolve=>{
  const url="https://contentinova.com/neoguidegetversion"
    axios.post(url,encrypt({reference_id})).then(res=>{
     return res.data
    }).catch(err=>{
      console.log("error in export or update json",err)
      resolve(false)
    })
  })

}

export default api;
