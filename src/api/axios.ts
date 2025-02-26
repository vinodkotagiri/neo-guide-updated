//@ts-nocheck
import axios from "axios";
import { ApplyZoomPayload, UploadVideoPayload } from "./payloads/payloads";
import { UploadVideoResponse } from "./responses/responses";
// import AWS from "aws-sdk";

const BASE_URL =
  import.meta.env.VITE_NODE_ENV == "local" ? "http://161.97.162.131:3000" : "https://recorder.effybiz.com/api";

const api = axios.create({
  baseURL: BASE_URL,
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
    if(payload.file.type=='video/mp4'){
      response = await s3.upload(params).promise();
    }
    else{
      const formData = new FormData();
      formData.append('file', file);
      const {file}=payload
      response= await api.post('/upload',formData,{headers:{'Content-Type': 'multipart/form-data'}})
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

export async function translateAndDub(payload: {
  s3_link: string;
  target_language: string;
  voice: string;
}): Promise<{ request_id: string }> {
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

export async function getLanguageList() {
  const url = `https://demo.effybiz.com/effybizgetlanguages`;
  return new Promise((resolve) => {
    axios
      .get(url)
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.log(err);
        resolve({});
      });
  });
}

export async function getLanguageVoiceList(Language_name_from_first_API: string) {
  // const url=`https://demo.effybiz.com/effybizgetlanguages`;
  const url = `https://demo.effybiz.com/effybizgetvoices?language=${Language_name_from_first_API}`;
  axios
    .get(url)
    .then((res) => {
      console.log("res::", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export async function getSubtitles(payload: {
  target_language: string;
  video_path: string;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/subtitle", payload)
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
      .post("/article_formate", payload)
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
      .post("/enhance_ai", payload)
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
      .post("/article_creation", payload)
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
      .post("/article_lang", payload)
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
      .post("/article_concise", payload)
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
      .post("/article_step", payload)
      .then((res) => {
        console.log('res',res)
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
      .post("/article_rephrase", payload)
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
  reference_image_path: string;
  video_path: string;
  gif_duration: number;
}): Promise<{ request_id: string }> {
  return new Promise((resolve) => {
    api
      .post("/generate-gif", payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("error generate-gif", error);
        resolve(null);
      });
  });
}

export default api;
