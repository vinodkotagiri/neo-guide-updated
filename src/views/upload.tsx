'use client'
import React from 'react'
import { uploadFile } from '../api/axios';
import { UploadVideoResponse } from '../api/responses/responses';
import { useAppDispatch } from '../redux/hooks';
import {useNavigate} from 'react-router-dom'
import {setLoader} from '../redux/features/loaderSlice'
import { setVideoUrl } from '../redux/features/videoSlice';
import toast from 'react-hot-toast';
function UploadView() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    dispatch(setLoader({loading:true,status:'please wait while we upload the file'}));
    if (file) {
      const response: UploadVideoResponse | null = await uploadFile({ user_id: '1', file });
      if (response) {
        window.localStorage.clear();
        dispatch(setVideoUrl(response.file_url));
        navigate(`/editor`);
        dispatch(setLoader({loading:false}))
      } else {
        dispatch(setLoader({loading:false}));
        return toast.error('Error uploading video');
      }

    }
  }

  async function handleInitiateRecording() {
    dispatch(setLoader({loading:true}));
    setTimeout(() => {
      navigate(`/recorder`);
      dispatch(setLoader({loading:false}))
    }, 1000);
  }
  
  return (
    <div className='min-w-screen min-h-screen bg-slate-900 text-slate-200 h-screen w-screen'>
      <div className='flex items-center justify-center h-full gap-3'>
        <button className='btn btn-lg' onClick={handleInitiateRecording}>Record Screen</button>
        <div className="divider divider-horizontal">OR</div>
        <label htmlFor="videoUpload" className="btn btn-lg bg-green-500">
          Upload Video
        </label>
        <input
          type="file"
          id='videoUpload'
          className="file-input file-input-bordered file-input-success w-full max-w-xs cursor-pointer hidden"
          accept='video/*'
          onChange={handleUploadFile}
        />
      </div>
    </div>
  )
}

export default UploadView