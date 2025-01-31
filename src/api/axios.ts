import axios from "axios";
import { ApplyZoomPayload, UploadVideoPayload } from "./payloads/payloads";
import { UploadVideoResponse } from "./responses/responses";
import AWS from "aws-sdk";

const BASE_URL = "http://161.97.162.131:3000";
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});

export function initiateScreenRecord() {}
export async function uploadFile(payload: UploadVideoPayload): Promise<UploadVideoResponse | null> {
  try {
    AWS.config.update({
      region: import.meta.env.VITE_AWS_REGION as string,
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string
    });
    const s3 = new AWS.S3();
    console.log("payload:::", payload);
    const params = {
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET as string,
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
export async function getProgress(
  requestId: string
): Promise<{ percentage: number; status: string; details: string } | null> {
  return new Promise((resolve) => {
    api
      .get(`/progress/${requestId}`)
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
    console.log("payload::", payload);
    api
      .post("/apply-zoom", payload)
      .then((res) => {
        resolve(res.data?.message?.split(" ")[0]);
      })
      .catch((error) => {
        console.log("error applying zoom", error);
        resolve(null);
      });
  });
}

export async function createArticle(payload: { video_url: string }) {
  return new Promise((resolve) => {
    api
      .post("/article/article_formate", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}

export async function translateAndDub(payload: { s3_link: string; target_language: string; voice: string }) {
  return new Promise((resolve) => {
    api
      .post("/dubbing", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error creating article", error);
        resolve(null);
      });
  });
}



export default api;


// Article formate_article, create_artile, enhance_ai