import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/axios';
import { useDispatch } from 'react-redux';
import { setVideoUrl } from '../redux/features/videoSlice';
import { setLoader } from '../redux/features/loaderSlice';

const InteractiveScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  // const [annotations, setAnnotations] = useState<{ x: number; y: number; text: string }[]>([]);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // const annotationOverlayRef = useRef<HTMLDivElement | null>(nul
  const navigate=useNavigate();
  const dispatch=useDispatch()
  useEffect(() => {
    return () => {
      // Clean up the stream and media recorder when component unmounts
      if (screenStream) {
        const tracks = screenStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [screenStream]);

  const startScreenRecording = async () => {
    try {
      // Ask the user to select a screen/window for recording
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true }
      });
  
      // Capture microphone audio separately (optional)
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      // Combine screen and microphone audio streams
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(), // Add screen video
        ...screenStream.getAudioTracks(), // Add system audio (if available)
        ...audioStream.getAudioTracks()   // Add microphone audio
      ]);
  
      setScreenStream(combinedStream);
  
      const recorder = new MediaRecorder(combinedStream);
      const recordedChunks: Blob[] = [];
  
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };
  
      recorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
      };
  
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing screen:", err);
      toast.error("Failed to access screen or microphone.");
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


  const handleSaveRecording = async() => {
    if (recordedVideoUrl) {
      try {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = 'screen_recording.webm';
      a.click();
      toast.success('file downloaded ')
        const blob = await fetch(recordedVideoUrl).then(r => r.blob()); // Convert URL to Blob
        const file = new File([blob], 'screen_recording.webm', { type: 'video/webm' });
        const response=await uploadFile({user_id:'1',file})
        if (response) {
          dispatch(setVideoUrl(response.file_url));
          navigate(`/editor`);
          dispatch(setLoader({loading:false}))
        } else {
          dispatch(setLoader({loading:false}));
          return toast.error('Error uploading video');
        }
  
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error('Video upload failed. Please try again.'); // Show error toast
      }
    }

  };

  return (
    <div className='w-full h-full bg-transparent px-3 py-2 flex items-center justify-center flex-col gap-4'>

      {/* Button to Start/Stop Recording */}
      <div className='flex gap-4'>
        <button className='btn btn-error text-error-content btn-sm' onClick={() => (isRecording ? stopScreenRecording() : startScreenRecording())}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <button onClick={togglePauseRecording} className='btn btn-secondary btn-sm'>
            {isPaused ? 'Resume Recording' : 'Pause Recording'}
          </button>
        )}
        {recordedVideoUrl && <button onClick={handleSaveRecording} className='btn btn-success btn-sm'>Save Recording</button>}
      </div>
      {/* Screen Recording Video */}
      <div style={{ position: 'relative' }} className='w-[60%] h-full border-slate-700'>
        <video
          controls
          width="100%"
          height="auto"
          src={recordedVideoUrl || ''}
          autoPlay
          muted
          style={{ width: '100%', height: 'auto' }}
        ></video>
      </div>
    </div>
  );
};

export default InteractiveScreenRecorder;