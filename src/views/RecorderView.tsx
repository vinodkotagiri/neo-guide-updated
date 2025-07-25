import React, { useEffect } from 'react'

import { useAppDispatch } from '../redux/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setLoader } from '../redux/features/loaderSlice'
import Navbar from '../components/global/Navbar';
import { BsRecordCircle } from 'react-icons/bs';
import InteractiveScreenRecorder from '../components/InteractiveAnnotationRecorder'
import toast from 'react-hot-toast';
import { setUserId, setUserName } from '../redux/features/videoSlice';

function RecorderPage() {
  const [startRecording, setStartRecording] = React.useState(false)
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  useEffect(()=>{
    const user_id=searchParams.get('user_id') ?? null;
    const user_name=searchParams.get('name') ?? null;
    if(!user_id) toast.error('User ID is required to upload a video');
    // if(!user_name) toast.error('User Name is required to upload a video');
    if(user_id){
      dispatch(setUserId(user_id.toString()));
      if(user_name)
      dispatch(setUserName(user_name.toString()));

    }

  },[searchParams,dispatch])
  async function handleInitiateRecording() {
    dispatch(setLoader({ loading: true }));
    setTimeout(() => {
      //navigate(`/recorder`);
      dispatch(setLoader({ loading: false }))
    }, 1000);
    setStartRecording(true)
  }

  return (
    <div className='   bg-[#16151a]   h-full'>
      <Navbar hideMenu={'/'} />
      {startRecording &&
        <InteractiveScreenRecorder />
      }
      {!startRecording &&
        <div className='flex  items-center h-3/4'>
          <div className="w-full max-w-xl mx-auto ">
            <div className="bg-[#212025] rounded-lg px-6 py-8 text-white">
              <div className="flex items-center mb-4">

                <h2 className="text-lg font-medium mb-3">Record Screen</h2>
              </div>

              {/* <p className="text-sm text-[#ccc] mb-6">Attachments that have been uploaded as part of this project.</p> */}
              {/* <label htmlFor="videoUpload"  > */}
              <div className="border-2 border-dashed border-[#422AD5] rounded-lg p-8 text-center cursor-pointer transition-colors bg-[#212025] hover:bg-[#1c1c21]">
                <div className="flex flex-col items-center justify-center" onClick={handleInitiateRecording}>
                  <BsRecordCircle className="h-10 w-10 text-[#422AD5] mb-4" />
                  <p className="mb-1 text-[#999] ">
                    Click to continue to screen recording
                  </p>
                  {/* <input
                          type="file"
                          id='videoUpload'
                          className="file-input file-input-bordered file-input-success w-full max-w-xs cursor-pointer hidden"
                          accept='video/*'
                          onChange={(e) => setSelectedFile(e.target.files?.[0])}
                        /> */}
                  {/* <button className='btn btn-lg' onClick={handleInitiateRecording}>Record Screen</button> */}
                  <p className="text-sm text-[#777] text-[12px]">Please select appropriate steps in the next screen</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default RecorderPage