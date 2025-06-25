/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import SubtitleHeader from './SubtitleHeader';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getSecondsFromTime } from '../../helpers';
import { getProgress, getSubtitles, textToSpeech } from '../../api/axios';
import toast from 'react-hot-toast';
import {
  setLocked,
  updateRetries,
  updateSubtitleData,
} from '../../redux/features/videoSlice';
import { setLoaderData } from '../../redux/features/loaderSlice';
import LocalLoader from '../global/LocalLoader';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';

function SubtitleAreaComponent({ playerRef }) {
  const { subtitles, played, url, retries } = useAppSelector((state) => state.video);
  const { percentage, status } = useAppSelector((state) => state.loader);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reqId, setReqId] = useState('');
  const dispatch = useAppDispatch();
  const { currentPlayTime } = useAppSelector((state) => state.video);
  const containerRef = useRef(null);

  const [selectedVoiceID, setSelectedVoiceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]); // Store audio URLs for each subtitle
  const [activeAudioIndex, setActiveAudioIndex] = useState(null);
  const audioRefs = useRef([]); // References to audio elements

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  // Clear audio URLs and stop playback when selectedVoiceID changes
  useEffect(() => {
    setAudioUrls([]);
    setActiveAudioIndex(null);
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    });
  }, [selectedVoiceID]);

  // Update current subtitle index based on video play time
  useEffect(() => {
    const idx = subtitles.data.findIndex((subtitle) => {
      return (
        getSecondsFromTime(subtitle.start_time) - 1 <= currentPlayTime &&
        getSecondsFromTime(subtitle.end_time) - 1 >= currentPlayTime
      );
    });
    if (currentIdx !== idx) setCurrentIdx(idx);
  }, [currentPlayTime]);

  // Scroll to the current subtitle
  useEffect(() => {
    if (currentIdx >= 0 && containerRef.current) {
      const subtitleHeight = 96;
      const containerHeight = containerRef.current.clientHeight;
      const targetScroll =
        currentIdx * subtitleHeight - containerHeight / 2 + subtitleHeight / 2;
      spring.set(Math.max(0, targetScroll));
    }
  }, [currentIdx]);

  // Fetch subtitles if none exist and retries are available
  useEffect(() => {
    if (!subtitles.data.length && retries < 3) {
      getSubtitles({ target_language: 'en', video_path: url })
        .then((res) => {
          const request_id = res?.request_id;
          if (request_id) setReqId(request_id);
        })
        .catch(() => {
          toast.error('Error uploading video');
          dispatch(setLocked(false));
        })
        .finally(() => {
          dispatch(setLocked(false));
        });
    }
  }, []);

  // Poll for subtitle data when request ID is available
  useEffect(() => {
    if (reqId) {
      getArticleData(reqId);
    }
  }, [reqId]);

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLocked(true));
      const interval = setInterval(() => {
        getProgress(request_id).then((res) => {
          if (res?.status?.toLowerCase() === 'completed') {
            clearInterval(interval);
            const data = res?.result?.subtitles;
            if (data?.error) {
              dispatch(setLocked(false));
              dispatch(updateSubtitleData([]));
              dispatch(updateRetries());
              toast.error(data?.error);
              return;
            }
            dispatch(updateSubtitleData(data));
            dispatch(setLocked(false));
          } else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }));
          }
        });
      }, 5000);
      setReqId('');
    }
  }

  // Determine if a subtitle is active based on video play time
  function isActiveStyle(start, end) {
    const startSeconds = getSecondsFromTime(start);
    const endSeconds = getSecondsFromTime(end);
    return startSeconds <= played && endSeconds >= played;
  }

  // Toggle audio playback for a subtitle
  const toggleAudio = async (index, item) => {
    if (!selectedVoiceID) {
      toast.error('No Voice is selected');
      return;
    }

    const audio = audioRefs.current[index];
    if (!audio) {
      console.error(`Audio element not found for index ${index}`);
      toast.error('Audio element not initialized');
      return;
    }

    // Pause any currently playing audio
    if (activeAudioIndex !== null && activeAudioIndex !== index) {
      const prevAudio = audioRefs.current[activeAudioIndex];
      if (prevAudio && !prevAudio.paused) {
        prevAudio.pause();
        setActiveAudioIndex(null);
      }
    }

    // If audio URL exists, toggle play/pause
    if (audioUrls[index]) {
      console.log(`Playing audio for index ${index}, URL: ${audioUrls[index]}`);
      if (audio.paused) {
        audio.volume = 1.0; // Ensure volume is set
        audio.play().catch((err) => {
          console.error(`Error playing audio for index ${index}:`, err);
          // toast.error('Error playing audio');
        });
        setActiveAudioIndex(index);
      } else {
        audio.pause();
        setActiveAudioIndex(null);
      }
      return;
    }

    // Fetch audio if not already fetched
    setLoading(true);
    const data = {
      voiceid: selectedVoiceID,
      text: item.text,
    };

    try {
      const audio_url = await textToSpeech(data);
      console.log('audio_url', audio_url);
      if (audio_url) {
        console.log(`Received audio URL for index ${index}: ${audio_url}`);
        // Test the audio URL
        // const testAudio = new Audio(audio_url);
        // testAudio.play().catch((err) => {
        //   console.error(`Test audio failed for URL ${audio_url}:`, err);
        //   toast.error('Invalid or inaccessible audio URL');
        // });

        // Update audio URLs array
        setAudioUrls((prev) => {
          const newUrls = [...prev];
          newUrls[index] = audio_url;
          return newUrls;
        });

        // Set audio source and play
        audio.src = audio_url;
        audio.volume = 1.0; // Ensure volume is set
        audio.play().catch((err) => {
          console.error(`Error playing audio for index ${index}:`, err);
          toast.error('Error playing audio');
        });
        setActiveAudioIndex(index);
      } else {
        console.error('No audio_url received from textToSpeech API');
        toast.error('Failed to generate audio');
      }
    } catch (err) {
      console.error('Error generating audio preview:', err);
      toast.error('Error generating audio preview');
    } finally {
      setLoading(false);
    }
  };

  // Initialize audio references and handle audio events
  useEffect(() => {
    // Initialize audio elements for each subtitle
    audioRefs.current = subtitles.data.map(
      (_, index) => audioRefs.current[index] || new Audio()
    );

    // Set up event listeners
    subtitles.data.forEach((_, index) => {
      const audio = audioRefs.current[index];
      if (audio) {
        audio.onended = () => {
          if (activeAudioIndex === index) {
            console.log(`Audio ended for index ${index}`);
            setActiveAudioIndex(null); // Reset active index to show play button
          }
        };
        audio.onerror = () => {
          // console.error(`Audio error for index ${index}:`, audio.error);
          setActiveAudioIndex(null);
        };
        audio.oncanplay = () => {
          console.log(`Audio ready to play for index ${index}`);
        };
      }
    });

    // Cleanup on unmount
    return () => {
      audioRefs.current.forEach((audio, index) => {
        if (audio) {
          audio.pause();
          audio.src = '';
          audio.onended = null;
          audio.onerror = null;
          audio.oncanplay = null;
          console.log(`Cleaned up audio for index ${index}`);
        }
      });
    };
  }, [subtitles.data]);

  return (
    <div className="w-full h-full mb-2" ref={containerRef}>
      <SubtitleHeader
        selectedVoiceID={selectedVoiceID}
        setSelectedVoiceID={setSelectedVoiceID}
        setSubAudioUrl={() => { }}
      />

      <motion.div
        className="flex flex-col gap-1 p-2 h-[93%] overflow-auto"
        style={{ translateY: -spring }}
      >
        {!subtitles.data.length ? (
          <div className="w-full h-full overflow-auto relative">
            <LocalLoader progress={percentage} text={status} />
          </div>
        ) : (
          subtitles.data.map((item, index) => (
            <motion.div
              className="flex py-1 items-center justify-between gap-1 cursor-pointer bg-[#212025] rounded-md"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={
                currentIdx === index && isActiveStyle(item.start_time, item.end_time)
                  ? { color: '#ffffff', backgroundColor: '#422AD5' }
                  : {}
              }
              onClick={() => playerRef.current.seekTo(getSecondsFromTime(item.start_time))}
            >
              <div className="flex flex-col h-full items-center justify-center px-2">
                <div className="text-[#ccc] text-[0.8rem]">{item?.start_time?.split(',')[0]}</div>
                <div className="text-[#ccc] text-[0.8rem]">{item?.end_time?.split(',')[0]}</div>
              </div>

              <p
                className="w-full h-auto p-2 py-3 text-[#ccc] subtitle-content text-[0.8rem] outline-0"
                dangerouslySetInnerHTML={{ __html: item.text }}
                contentEditable
              />

              <div className="mx-5">
                <audio ref={(el) => (audioRefs.current[index] = el)} />
                {loading && activeAudioIndex === index ? (
                  <div className="loader" />
                ) : activeAudioIndex === index && audioRefs.current[index] && !audioRefs.current[index].paused ? (
                  <IoPauseOutline
                    size={24}
                    className="text-[#ccc] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(index, item);
                    }}
                  />
                ) : (
                  <IoPlayOutline
                    size={24}
                    className="text-[#ccc] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(index, item);
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default SubtitleAreaComponent;