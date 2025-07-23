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
import { useAppSelector } from '../redux/hooks';
import Desktop from "../assets/monitor.png";
const InteractiveScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoFormat, setVideoFormat] = useState<{ mimeType: string; extension: string }>({
    mimeType: 'video/mp4; codecs=avc3',
    extension: 'mp4',
  });
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
      console.log('Starting screen recording...');
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
        console.log('MP4 not supported, falling back to WebM');
        selectedFormat = { mimeType: 'video/webm', extension: 'webm' };
        toast.error('MP4 recording not supported in this browser. Using WebM instead.');
      } else {
        console.log('MP4 recording supported');
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
          console.log('Received data chunk, size:', event.data.size);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped, creating video blob...');
        const videoBlob = new Blob(recordedChunks, { type: selectedFormat.mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log('Screen recording started in', selectedFormat.mimeType);
    } catch (err) {
      console.error('Error accessing screen:', err);
      toast.error('Failed to access screen or microphone.');
    }
    setCountdown(3);
  };

  const stopScreenRecording = () => {
    if (mediaRecorder) {
      console.log('Stopping screen recording...');
      mediaRecorder.stop();
    }
    setIsRecording(false);

  };

  const togglePauseRecording = () => {
    if (mediaRecorder) {
      if (isPaused) {
        console.log('Resuming recording...');
        mediaRecorder.resume();
      } else {
        console.log('Pausing recording...');
        mediaRecorder.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleSaveRecording = async () => {
    if (recordedVideoUrl) {
      try {
        console.log('Starting save recording process...');
        dispatch(setLoader({ loading: true }));
        // toast('Preparing to save recording...', { duration: 2000 });

        const videoBlob = await fetch(recordedVideoUrl).then((r) => r.blob());
        console.log('Fetched video blob, size:', videoBlob.size);

        // Download the video file
        const a = document.createElement('a');
        a.href = recordedVideoUrl;
        a.download = `screen_recording_${new Date()}.${videoFormat.extension}`;
        a.click();
        console.log('Video download triggered');
        toast.success(`File downloaded as ${videoFormat.extension.toUpperCase()}`);
        dispatch(setLoader({ loading: false }));
        // navigate('/upload')
        const file = new File([videoBlob], `screen_recording-${Date.now()}.${videoFormat.extension}`, {
          type: videoFormat.mimeType,
        });
        const response = await uploadFile({ user_id: '1', file });
        if (response.file_url) {
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


  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setIsRecording(true);
      // Add your recording start logic here
    }

    return () => clearTimeout(timer);
  }, [countdown]);
  return (
    <div className="w-full bg-transparent px-3 py-2 flex items-center justify-center flex-col gap-4">
      {/* Button to Start/Stop Recording */}

      {/* Screen Recording Video */}
      <div style={{ position: 'relative' }} className="w-[60%] ">
        {recordedVideoUrl && <video
          controls
          width="100%"
          height="auto"
          src={recordedVideoUrl || ''}
          autoPlay
          muted
          style={{ width: '100%', height: 'auto' }}
        ></video>}
      </div>
      <div className="flex gap-4 flex-col w-[60%] items-center">
        <div className="border-2 border-dashed border-[#422AD5] rounded-lg w-full h-[60vh] flex justify-center items-center start-record">
          {!isRecording && countdown === null && (
            <div className='  text-center flex justify-center items-center text-3xl text-[#999] flex-col gap-8'>
              <img src={Desktop} alt='' className='w-1/4' />

              Click to start recording</div>
          )}
          {countdown !== null && (
            <div className=' w-[150px] h-[150px] p-10 text-center rounded-full flex justify-center items-center text-6xl text-white '> {countdown}</div>
          )}
        </div>
        <button
          className="  cursor-pointer  mt-5 w-fit text-xl  btn-grad"
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
      {/* <div className='fixed right-0   bg-[#333] text-white flex flex-col rounded-ss-md rounded-es-md px-2 '>
        <button
          className="   text-[#ccc] cursor-pointer  py-2    font-medium text-xl border-b border-[#ccc] "
          onClick={() => (isRecording ? stopScreenRecording() : startScreenRecording())}
        >
          
          {isRecording ? <div className='tooltip tooltip-left' data-tip="Stop Recording"><BsStopCircle className='text-red-500 ' /> </div> : <div className='tooltip tooltip-left' data-tip="Start Recording"><BsRecordCircle /></div>}
        </button>
        <button onClick={togglePauseRecording} className="  text-[#ccc] cursor-pointer  py-2 border-b border-[#ccc]  font-medium text-xl ">
          {isPaused ? <div className='tooltip tooltip-left' data-tip="Resume Recording"><GrResume /></div>
            : <div className='tooltip tooltip-left' data-tip="Pause Recording"><BsPauseCircle /></div>}
        </button>
        <button onClick={handleSaveRecording} className=" text-[#ccc]  cursor-pointer py-2   font-medium text-xl tooltip tooltip-left" data-tip="Export Recording">
          <TbFileExport />
        </button>

      </div> */}
    </div>
  );
};

export default InteractiveScreenRecorder;