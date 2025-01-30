import axios from "axios";
import { ApplyZoomPayload, UploadVideoPayload } from "./payloads/payloads";
import { UploadVideoResponse } from "./responses/responses";
import AWS from "aws-sdk";

const BASE_URL = "http://161.97.162.131:3000";
const api = axios.create({
  baseURL: BASE_URL
});

// const INITIATE_SCREEN_RECORD = "/record/initiate";
// const UPLOAD_FILE = "/upload";
// const GET_TRANSCRIPT = "/video/trascription";
// const TRANSLATE_SCRIPT = "/api/translate";
// const DUB_VIDEO = "/dub";
// const ADD_SUBTIITLE = "/subtitles/add";
// const VIDEO_EDIT = "/video/edit";
// const GENERATE_ARTICLE = "/article/generate";
// const EDIT_ARTICLE = "/article/edit";
// const CREATE_GIF = "/gif/create";

export function initiateScreenRecord() {}
export async function uploadFile(payload: UploadVideoPayload): Promise<UploadVideoResponse | null> {
  try {
    AWS.config.update({
      region: process.env.VITE_AWS_REGION as string,
      accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY as string
    });
    const s3 = new AWS.S3();
    console.log("payload:::", payload);
    const params = {
      Bucket: process.env.VITE_AWS_S3_BUCKET as string,
      Key: payload.file.name,
      Body: payload.file,
      ContentType: payload.file.type
    };
    const response = await s3.upload(params).promise();
    if (!response.Location) return null;
    return { file_url: response.Location };
  } catch (error) {
    console.log("error uploading file:", error);
    return null;
  }
}
export async function getProgress():Promise<{percentage:number,status:string,details:string}|null> {
  return new Promise((resolve) => {
    api
      .get("/progress")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log("err:", err);
        return null;
      });
  });
}

export async function applyZoom(payload:ApplyZoomPayload){
  return new Promise((resolve) => {
    console.log('payload::',payload)
    api.post("/apply-zoom", payload).then((res) => {
      resolve(res.data?.message?.split(' ')[0]);
    }).catch(error=>{
      console.log('error applying zoom',error);
      resolve(null)
    })
  } )
}

export async function createArticle(payload:{video_url:string}){
  return new Promise((resolve) => {
    api.post("/article/article_creation", payload).then((res) => {
      resolve(res.data);
    }).catch(error=>{
      console.log('error creating article',error);
      resolve(null)
    })
  } )
}
export default api;