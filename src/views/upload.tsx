'use client'
import React, { useEffect } from 'react'
import { uploadFile } from '../api/axios';
import { UploadVideoResponse } from '../api/responses/responses';
import { useAppDispatch } from '../redux/hooks';
import { useNavigate } from 'react-router-dom'
import { setLoader } from '../redux/features/loaderSlice'
import { setVideoUrl, updateSubtitleData } from '../redux/features/videoSlice';
import toast from 'react-hot-toast';
import { setArticleData } from '../redux/features/articleSlice';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';
import Navbar from '../components/global/Navbar';
import { formatBytes } from '../helpers';
import { BsFillRecordCircleFill } from 'react-icons/bs';
function UploadView() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  async function handleUploadFile() {
    window.localStorage.clear();
    dispatch(setArticleData([]));
    dispatch(setVideoUrl(''));
    dispatch(updateSubtitleData([]));
    // const file = e.target.files?.[0];
    const file = selectedFile
    dispatch(setLoader({ loading: true, status: 'please wait while we upload the file' }));
    if (file) {
      const response: UploadVideoResponse | null = await uploadFile({ user_id: '1', file });
      if (response) {
        dispatch(setVideoUrl(response.file_url));
        navigate(`/editor`);
        dispatch(setLoader({ loading: false }))
      } else {
        dispatch(setLoader({ loading: false }));
        return toast.error('Error uploading video');
      }

    }
  }

  console.log('selectedFile', selectedFile)
  async function handleInitiateRecording() {
    dispatch(setLoader({ loading: true }));
    setTimeout(() => {
      navigate(`/recorder`);
      dispatch(setLoader({ loading: false }))
    }, 1000);
  }

  return (
    <div className='   bg-[#16151a]   h-full'>
      <Navbar hideMenu={'/'} />

      {/* <button className='btn btn-lg' onClick={handleInitiateRecording}>Record Screen</button> */}

      <div className='flex  items-center h-3/4'>

        <div className="w-full max-w-xl mx-auto ">
          <div className="bg-[#212025] rounded-lg p-6 text-white">
            <div className="flex items-center mb-4">

              <h2 className="text-lg font-medium">Upload Video file</h2>
            </div>

            <p className="text-sm text-[#ccc] mb-4">Attachments that have been uploaded as part of this project.</p>
            <label htmlFor="videoUpload"  >
              <div className="border-2 border-dashed border-[#422AD5] rounded-lg p-8 text-center cursor-pointer transition-colors bg-[#212025] hover:bg-[#1c1c21]">
                <div className="flex flex-col items-center justify-center">
                  <IoCloudUploadOutline className="h-10 w-10 text-[#422AD5] mb-4" />
                  <p className="mb-1 text-[#999] ">
                    Drag & drop your files here or  choose files
                  </p>
                  <input
                    type="file"
                    id='videoUpload'
                    className="file-input file-input-bordered file-input-success w-full max-w-xs cursor-pointer hidden"
                    accept='video/*'
                    onChange={(e) => setSelectedFile(e.target.files?.[0])}
                  />
                  <p className="text-sm text-[#777] text-[12px]">500 MB max file size.</p>
                </div>
              </div>

            </label>
            {selectedFile && <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Uploaded file</h3>
              <div className="space-y-3">

                <div className="bg-[#16151a] rounded-md p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <button className="text-slate-400 hover:text-white cursor-pointer" onClick={() => {
                      setSelectedFile(null)
                      window.location.reload()
                    }}>
                      <MdOutlineClose className="h-4 w-4" />
                    </button>
                  </div>


                </div>

              </div>
            </div>}
            <div className="flex justify-end gap-2 mt-6  items-center ">
              {/* <button className="bg-[#16151a] text-white  px-3 py-2 cursor-pointer rounded-md font-semibold">
                Cancel
              </button> */}
              {selectedFile && (
                <button className=" bg-[#422AD5] px-3 py-2 cursor-pointer rounded-md font-semibold disabled:cursor-not-allowed" onClick={handleUploadFile} disabled={!selectedFile}>Upload</button>
              )}
            </div>
          </div>
        </div>


      </div>





      {/* <input
          type="file"
          id='videoUpload'
          className="file-input file-input-bordered file-input-success w-full max-w-xs cursor-pointer hidden"
          accept='video/*'
          onChange={handleUploadFile}
        /> */}


    </div>
  )
}

export default UploadView