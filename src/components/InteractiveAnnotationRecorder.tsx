import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/features/loaderSlice';

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
        navigate('/upload')
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
    <div className="w-full h-full bg-transparent px-3 py-2 flex items-center justify-center flex-col gap-4">
      {/* Button to Start/Stop Recording */}
      <div className="flex gap-4">
        <button
          className="btn btn-error text-error-content btn-sm"
          onClick={() => (isRecording ? stopScreenRecording() : startScreenRecording())}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <button onClick={togglePauseRecording} className="btn btn-secondary btn-sm">
            {isPaused ? 'Resume Recording' : 'Pause Recording'}
          </button>
        )}
        {recordedVideoUrl && (
          <button onClick={handleSaveRecording} className="btn btn-success btn-sm">
            Save Recording
          </button>
        )}
      </div>
      {/* Screen Recording Video */}
      <div style={{ position: 'relative' }} className="w-[60%] h-full border-slate-700">
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