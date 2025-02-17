import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { setIsRecording } from '@/app/features/workingSlice';
import { useDispatch } from 'react-redux';
import { MdStart, MdStop } from 'react-icons/md';
import { BsFillRecordCircleFill } from 'react-icons/bs';
import { FaStopCircle } from 'react-icons/fa';

const RecordDialouge: React.FC = () => {
  const { isRecording } = useSelector((state: RootState) => state.working);
  const [recording, setRecording] = useState(false)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch<AppDispatch>();


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
      setRecording(true)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...audioStream.getAudioTracks()
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

    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setRecording(false);
  };


  const handleSaveRecording = async () => {
    if (recordedVideoUrl) {
      try {
        const a = document.createElement('a');
        a.href = recordedVideoUrl;
        a.download = 'screen_recording.mp4';
        a.click();

        const blob = await fetch(recordedVideoUrl).then(r => r.blob());
        const file = new File([blob], 'screen_recording.mp4', { type: 'video/mp4' });
        console.log('file:::', file)
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isRecording && (
        <Dialog static open={isRecording} onClose={() => dispatch(setIsRecording(false))} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg space-y-4 bg-white p-12 rounded-md"
            >
              <div className='flex gap-4'>
                <button
                  className='cursor-pointer'
                  onClick={() => (recording ? stopScreenRecording() : startScreenRecording())}
                >
                  {recording ? (
                    <FaStopCircle size={32} className='text-red-500' />
                  ) : (
                    <BsFillRecordCircleFill size={32} className='text-green-500' />
                  )}
                </button>

                {recordedVideoUrl && (
                  <button
                    onClick={handleSaveRecording}
                    className='btn btn-success btn-sm'
                  >
                    Save Recording
                  </button>
                )}
              </div>

              {/* Screen Recording Video */}
              <div style={{ position: 'relative' }} className='w-full h-full border-slate-700'>
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

            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default RecordDialouge;
