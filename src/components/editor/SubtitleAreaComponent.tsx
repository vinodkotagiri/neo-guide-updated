/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [reqId, setReqId] = useState('');
  const dispatch = useAppDispatch();
  const containerRef = useRef(null);

  const [selectedVoiceID, setSelectedVoiceID] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [activeAudioIndex, setActiveAudioIndex] = useState(null);
  const audioRefs = useRef([]);

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

  useEffect(() => {
    const idx = subtitles.data.findIndex((subtitle) => {
      const startSeconds = getSecondsFromTime(subtitle.start_time);
      const endSeconds = getSecondsFromTime(subtitle.end_time);
      return startSeconds <= played && endSeconds >= played;
    });
    if (idx !== currentIdx) {
      setCurrentIdx(idx);
    }
  }, [played]);

  // ✅ Auto-scroll to current subtitle
  useEffect(() => {
    if (currentIdx >= 0 && containerRef.current) {
      const currentEl = containerRef.current.querySelector(
        `[data-subtitle-index="${currentIdx}"]`
      );
      if (currentEl) {
        currentEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentIdx]);

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

  function isActiveStyle(start, end) {
    const startSeconds = getSecondsFromTime(start);
    const endSeconds = getSecondsFromTime(end);
    return startSeconds <= played && endSeconds >= played;
  }

  const toggleAudio = async (index, item) => {
    if (!selectedVoiceID) {
      toast.error('No Voice is selected');
      return;
    }

    const audio = audioRefs.current[index];
    if (!audio) {
      toast.error('Audio element not initialized');
      return;
    }

    if (activeAudioIndex !== null && activeAudioIndex !== index) {
      const prevAudio = audioRefs.current[activeAudioIndex];
      if (prevAudio && !prevAudio.paused) {
        prevAudio.pause();
        setActiveAudioIndex(null);
      }
    }

    if (audioUrls[index]) {
      if (audio.paused) {
        audio.volume = 1.0;
        audio.play().catch(console.error);
        setActiveAudioIndex(index);
      } else {
        audio.pause();
        setActiveAudioIndex(null);
      }
      return;
    }

    setLoading(true);
    try {
      const audio_url = await textToSpeech({ voiceid: selectedVoiceID, text: item.text, from:"subtitle" });
      if (audio_url) {
        setAudioUrls((prev) => {
          const newUrls = [...prev];
          newUrls[index] = audio_url;
          return newUrls;
        });

        audio.src = audio_url;
        audio.volume = 1.0;
        audio.play().catch(console.error);
        setActiveAudioIndex(index);
      } else {
        toast.error('Failed to generate audio');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error generating audio preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    audioRefs.current = subtitles.data.map(
      (_, index) => audioRefs.current[index] || new Audio()
    );

    subtitles.data.forEach((_, index) => {
      const audio = audioRefs.current[index];
      if (audio) {
        audio.onended = () => {
          if (activeAudioIndex === index) {
            setActiveAudioIndex(null);
          }
        };
        audio.onerror = () => setActiveAudioIndex(null);
        audio.oncanplay = () => { };
      }
    });

    return () => {
      audioRefs.current.forEach((audio, index) => {
        if (audio) {
          audio.pause();
          audio.src = '';
          audio.onended = null;
          audio.onerror = null;
          audio.oncanplay = null;
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

      <motion.div className="flex flex-col gap-1 p-2 h-[93%] overflow-auto">
        {!subtitles.data.length ? (
          <div className="w-full h-full overflow-auto relative">
            <LocalLoader progress={percentage} text={status} />
          </div>
        ) : (
          subtitles.data.map((item, index) => (
            <motion.div
              data-subtitle-index={index}
              className="flex py-1 items-center justify-between gap-1 cursor-pointer bg-[#212025] rounded-md"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isActiveStyle(item.start_time, item.end_time) ? 1 : 0.7,
                backgroundColor: isActiveStyle(item.start_time, item.end_time)
                  ? '#422AD5'
                  : '#212025',
                color: isActiveStyle(item.start_time, item.end_time) ? '#ffffff' : '#ccc',
                transition: { duration: 0.3 },
              }}
              onClick={() => playerRef.current.seekTo(getSecondsFromTime(item.start_time))}
            >
              <div className="flex flex-col h-full items-center justify-center px-2 ">
                <div className="text-[0.8rem]">{item?.start_time?.split(',')[0]}</div>
                <div className="text-[0.8rem]">{item?.end_time?.split(',')[0]}</div>
              </div>

              <p
                className="w-full h-auto p-2 py-3 subtitle-content text-[0.8rem] outline-0"
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
