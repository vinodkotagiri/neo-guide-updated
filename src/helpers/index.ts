
export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${Number(secs).toFixed(0)}`;
}

export function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export function getSecondsFromTime(time) {
  const [hours, minutes, seconds] = time.split(":");
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}


export function generateRandomString(length: number=10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


export function convertToIST(timestampMs: number): string {
  const date = new Date(timestampMs);

  // Convert date to IST by using toLocaleString with timeZone
  const istString = date.toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Convert "14/06/2025, 14:21:46" to "2025-06-14 14:21:46"
  const [day, month, yearAndTime] = istString.split('/');
  const [year, time] = yearAndTime.split(', ');
  
  return `${year}-${month}-${day} ${time}`;
}

import CryptoJS from "crypto-js";
const KEY=import.meta.env.VITEVITE_ENC_KEY as string;
const IV=import.meta.env.VITEVITE_ENC_IV as string;

export const decrypt = function (val) {
  try{

    const decrypted = CryptoJS.AES.decrypt(val,
       CryptoJS.enc.Utf8.parse(KEY), 
    { mode: CryptoJS.mode.CBC,
       iv : CryptoJS.enc.Utf8.parse(IV) }).toString(CryptoJS.enc.Latin1);
    return decrypted;
  }catch(err){
    console.log('error decrypting', err);
    return val
  }
}



export const encrypt = val => {
  try{
    val= typeof val === 'string' ? val : JSON.stringify(val); 
    const cryptobject = CryptoJS.AES.encrypt(val, CryptoJS.enc.Utf8.parse(KEY), 
    { mode: CryptoJS.mode.CBC, iv : CryptoJS.enc.Utf8.parse(IV) });
    return cryptobject+"";
  }catch(error){
    console.log('error encrypting', error);
    return val
  }
};
