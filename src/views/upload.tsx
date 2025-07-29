//@ts-nocheck
'use client'
import React, { useEffect } from 'react'
import { uploadFile } from '../api/axios';
import { UploadVideoResponse } from '../api/responses/responses';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setLoader } from '../redux/features/loaderSlice'
import { setUserId, setVideoUrl, updateSubtitleData, setUserName } from '../redux/features/videoSlice';
import toast from 'react-hot-toast';
import { setArticleData } from '../redux/features/articleSlice';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdOutlineClose } from 'react-icons/md';
import Navbar from '../components/global/Navbar';
import { formatBytes } from '../helpers';
import logo from '../assets/images/neo-logo.png'
function UploadView() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [audioOption, setAudioOption] = React.useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user_id } = useAppSelector(state => state.video)
  useEffect(() => {
    const user_id = searchParams.get('user_id') ?? null;
    const user_name = searchParams.get('name') ?? null;
    if (!user_id) toast.error('User ID is required to upload a video');
    if (user_id) {
      dispatch(setUserId(user_id?.toString()));
      if (user_name)
        dispatch(setUserName(user_name?.toString()));
    }
  }, [searchParams])

  async function handleUploadFile() {
    window.localStorage.clear();
    dispatch(setArticleData([]));
    dispatch(setVideoUrl(''));
    dispatch(updateSubtitleData([]));
    const file = selectedFile
    dispatch(setLoader({ loading: true, status: 'please wait while we upload the file' }));
    if (file) {
      const response: UploadVideoResponse | null = await uploadFile({ user_id, file });
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

  async function handleInitiateRecording() {
    dispatch(setLoader({ loading: true }));
    setTimeout(() => {
      navigate(`/recorder`);
      dispatch(setLoader({ loading: false }))
    }, 1000);
  }

  return (
    <>
      <div className='res-mobi h-full  bg-[#16151a] p-8 '>
        <div className='flex h-full items-center justify-center flex-col gap-5'>
          <a href="https://neocontent.ai/" ><img src={logo} alt='' /></a>
          <h2 className='text-white text-2xl text-center'> This application is best viewed on a laptop or desktop</h2>
        </div>
      </div>
      <div className='bg-[#16151a] h-full res-dektop'>
        <Navbar hideMenu={'/'} />
        <div className='flex items-center h-3/4'>
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-[#212025] rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium">Upload Video file</h2>
              </div>
              <p className="text-sm text-[#ccc] mb-4">Attachments that have been uploaded as part of this project.</p>
              {!selectedFile && (
                <label htmlFor="videoUpload">
                  <div
                    className="border-2 border-dashed border-[#422AD5] rounded-lg p-8 text-center cursor-pointer transition-colors bg-[#212025] hover:bg-[#1c1c21]"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add('bg-[#1c1c21]');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('bg-[#1c1c21]');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('video/')) {
                        setSelectedFile(file);
                      } else {
                        toast.error('Please drop a valid video file');
                      }
                      e.currentTarget.classList.remove('bg-[#1c1c21]');
                    }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <IoCloudUploadOutline className="h-10 w-10 text-[#422AD5] mb-4" />
                      <p className="mb-1 text-[#999] ">
                        Choose file
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
              )}
              {selectedFile && (
                <>
                  <div className='flex justify-between gap-5 mt-4'>
                    <label htmlFor="withAudio" className='w-full '>
                      <div className=" border-2 border-dashed border-[#422AD5] rounded-lg p-4  cursor-pointer transition-colors bg-[#212025] hover:bg-[#1c1c21]"> <input type="radio" name="radio-1" className="radio-primary radio mr-2" defaultChecked id="withAudio" checked={audioOption === "with"}
                        onChange={() => setAudioOption("with")} /> Video has audio</div>
                    </label>
                    <label htmlFor="withoutAudio" className='w-full '>
                      <div className=" border-2 border-dashed border-[#422AD5] rounded-lg p-4  cursor-pointer transition-colors bg-[#212025] hover:bg-[#1c1c21] "><input type="radio" name="radio-1" className="radio-primary radio mr-2 text-[#422AD5]" id="withoutAudio" checked={audioOption === "without"}
                        onChange={() => setAudioOption("without")} /> Video is without audio</div>
                    </label>
                  </div>

                </>
              )}
              {selectedFile && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Uploaded file</h3>
                  <div className="space-y-3">
                    <div className="bg-[#16151a] rounded-md p-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-medium truncate  text-wrap mb-2">{selectedFile.name}</p>
                          <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
                        </div>
                        <button
                          className="text-slate-400 hover:text-white cursor-pointer"
                          onClick={() => {
                            setSelectedFile(null)
                            window.location.reload()
                          }}
                        >
                          <MdOutlineClose className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-6 items-center h-[40px]">
                {selectedFile && audioOption && (
                  <button
                    className="bg-[#422AD5] px-3 py-2 cursor-pointer rounded-md font-semibold disabled:cursor-not-allowed"
                    onClick={handleUploadFile}
                    disabled={!selectedFile}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadView