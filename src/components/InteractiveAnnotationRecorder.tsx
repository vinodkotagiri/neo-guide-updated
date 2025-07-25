import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/features/loaderSlice';
import { BsPauseCircle, BsRecordCircle, BsStopCircle } from 'react-icons/bs';
import { GrResume } from 'react-icons/gr';
import { TbFileExport } from 'react-icons/tb';
import { uploadFile } from '../api/axios';
import { setVideoUrl } from '../redux/features/videoSlice';

const InteractiveScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoFormat, setVideoFormat] = useState<{ mimeType: string; extension: string }>({
    mimeType: 'video/mp4; codecs=avc3',
    extension: 'mp4',
  });
  useEffect(() => {
    setIsRecording(true);
    startScreenRecording();
  },[]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (screenStream) {
        const tracks = screenStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [screenStream]);

  const startScreenRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      setScreenStream(combinedStream);

      // Check if MP4 is supported, fallback to WebM if not
      let selectedFormat = { mimeType: 'video/mp4; codecs=avc3', extension: 'mp4' };
      if (!MediaRecorder.isTypeSupported('video/mp4; codecs=avc3')) {
   
        selectedFormat = { mimeType: 'video/webm', extension: 'webm' };
        toast.error('MP4 recording not supported in this browser. Using WebM instead.');
      } else {

        toast.success('Recording in MP4 format');
      }
      setVideoFormat(selectedFormat);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedFormat.mimeType,
      });
      const recordedChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);

        }
      };

      recorder.onstop = () => {

        const videoBlob = new Blob(recordedChunks, { type: selectedFormat.mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

    } catch (err) {
      console.error('Error accessing screen:', err);
      toast.error('Failed to access screen or microphone.');
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorder) {

      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  const togglePauseRecording = () => {
    if (mediaRecorder) {
      if (isPaused) {

        mediaRecorder.resume();
      } else {

        mediaRecorder.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleSaveRecording = async () => {
    if (recordedVideoUrl) {
      try {

        dispatch(setLoader({ loading: true }));
        // toast('Preparing to save recording...', { duration: 2000 });

        const videoBlob = await fetch(recordedVideoUrl).then((r) => r.blob());

        // Download the video file
        const a = document.createElement('a');
        a.href = recordedVideoUrl;
        a.download = `screen_recording_${new Date()}.${videoFormat.extension}`;
        a.click();

        toast.success(`File downloaded as ${videoFormat.extension.toUpperCase()}`);
        dispatch(setLoader({ loading: false }));
        // navigate('/upload')
        const file = new File([videoBlob], `screen_recording-${Date.now()}.${videoFormat.extension}`, {
          type: videoFormat.mimeType,
        });
        const response = await uploadFile({ user_id: '1', file });
        if(response.file_url){
          dispatch(setVideoUrl(response.file_url));
          navigate('/editor')
        }
        else
         toast.error("Error uploading video")
        
      } catch (error) {
        console.error('Error processing video:', error);
        dispatch(setLoader({ loading: false }));
        toast.error('Video processing failed. Please try again.');
      }
    } else {
      console.error('No recorded video URL available');
      toast.error('No recording available to save.');
    }
  };

  return (
    <div className="w-full bg-transparent px-3 py-2 flex items-center justify-center flex-col gap-4">
      {/* Button to Start/Stop Recording */}

      {/* Screen Recording Video */}
      <div style={{ position: 'relative' }} className="w-[60%] ">
        {recordedVideoUrl&&<video
          controls
          width="100%"
          height="auto"
          src={recordedVideoUrl || ''}
          autoPlay
          muted
          style={{ width: '100%', height: 'auto' }}
        ></video>}
      </div>
      <div className="flex gap-4">
        <button
          className=" bg-[#422AD5] text-white cursor-pointer px-3 py-2 rounded-md  font-medium "
          onClick={() => (isRecording ? stopScreenRecording() : startScreenRecording())}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <button onClick={togglePauseRecording} className=" bg-[#39383d] text-white cursor-pointer px-3 py-2 rounded-md  font-medium ">
            {isPaused ? 'Resume Recording' : 'Pause Recording'}
          </button>
        )}
        {recordedVideoUrl && (
          <button onClick={handleSaveRecording} className="bg-red-500 text-white cursor-pointer px-3 py-2 rounded-md  font-medium">
            Save Recording
          </button>
        )}
      </div>
      <div className='fixed right-0   bg-[#333] text-white flex flex-col rounded-ss-md rounded-es-md px-2 '>
        <button
          className="   text-[#ccc] cursor-pointer  py-2    font-medium text-xl border-b border-[#ccc] "
          onClick={() => (isRecording ? stopScreenRecording() : startScreenRecording())}
        >
          {/* {isRecording ? 'Stop Recording' : 'Start Recording'} */}
          {isRecording ? <div className='tooltip tooltip-left' data-tip="Stop Recording"><BsStopCircle className='text-red-500 ' /> </div> : <div className='tooltip tooltip-left' data-tip="Start Recording"><BsRecordCircle /></div>}
        </button>
        <button onClick={togglePauseRecording} className="  text-[#ccc] cursor-pointer  py-2 border-b border-[#ccc]  font-medium text-xl ">
          {isPaused ? <div className='tooltip tooltip-left' data-tip="Resume Recording"><GrResume /></div>
            : <div className='tooltip tooltip-left' data-tip="Pause Recording"><BsPauseCircle /></div>}
        </button>
        <button onClick={handleSaveRecording} className=" text-[#ccc]  cursor-pointer py-2   font-medium text-xl tooltip tooltip-left" data-tip="Export Recording">
          <TbFileExport />
        </button>

      </div>
    </div>
  );
};

export default InteractiveScreenRecorder;