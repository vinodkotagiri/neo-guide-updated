//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import { MdFindReplace } from 'react-icons/md';
import Flag from 'react-world-flags';
import FindAndReplaceComponent from './FindAndReplaceComponent';
import toast from 'react-hot-toast';
import { mergeAudio, mergeAudioProgress, textToSpeech } from '../../api/axios';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { generateRandomString, getSecondsFromTime } from '../../helpers';
import { setTargetLanguage, setVideoUrl, setVoice, setVoiceId, setVoiceLanguage } from '../../redux/features/videoSlice';
import { elvenLanguages, elvenVoices, Language, Voice } from '../../constants';
import { setLoader } from '../../redux/features/loaderSlice';

interface SubtitleHeaderProps {
  selectedVoiceID: string;
  setSelectedVoiceID: (voiceID: string) => void;
  setSubAudioUrl: (url: string) => void;
}

const SubtitleHeader: React.FC<SubtitleHeaderProps> = ({ selectedVoiceID, setSelectedVoiceID, setSubAudioUrl }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const [languageList, setLanguageList] = useState<Language[] | undefined>(undefined);
  const [voiceList, setVoiceList] = useState<Voice[] | undefined>(undefined);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mergeToken, setMergeToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useAppDispatch();
  const { subtitles, url ,isDisabled} = useAppSelector((state) => state.video);

  // Initialize language and voice lists
  useEffect(() => {
    setLanguageList(elvenLanguages);
    setSelectedLanguage(elvenLanguages[0]?.language_id);
    const initialVoices = elvenVoices.find((voice) => voice.language_id === elvenLanguages[0]?.language_id)?.voices;
    setVoiceList(initialVoices);
    if (initialVoices && initialVoices.length > 0) {
      setSelectedVoice(initialVoices[0].voiceid);
      setSelectedVoiceID(initialVoices[0].voiceid);
      setAudioUrl(initialVoices[0].preview);
      setSelectedName(initialVoices[0].voice);
      dispatch(setTargetLanguage({ targetLang: elvenLanguages[0].language_id.substr(0, 2), targetLangName: elvenLanguages[0].language }));
      dispatch(setVoice(initialVoices[0].voice));
      dispatch(setVoiceId(initialVoices[0].voiceid));
      dispatch(setVoiceLanguage(elvenLanguages[0].language_id));
    }
  }, [dispatch, setSelectedVoiceID]);

  // Update voice list and selected voice when language changes
  useEffect(() => {
    if (selectedLanguage) {
      const newVoiceList = elvenVoices.find((voice) => voice.language_id === selectedLanguage)?.voices;
      setVoiceList(newVoiceList);
      if (newVoiceList && newVoiceList.length > 0) {
        setSelectedVoice(newVoiceList[0].voiceid);
        setSelectedVoiceID(newVoiceList[0].voiceid);
        setAudioUrl(newVoiceList[0].preview);
        setSelectedName(newVoiceList[0].voice);
        dispatch(setTargetLanguage({ targetLang: selectedLanguage.substr(0, 2), targetLangName: elvenLanguages.find((lang) => lang.language_id === selectedLanguage)?.language || selectedLanguage }));
        dispatch(setVoice(newVoiceList[0].voice));
        dispatch(setVoiceId(newVoiceList[0].voiceid));
        dispatch(setVoiceLanguage(selectedLanguage));
      } else {
        setSelectedVoice('');
        setSelectedVoiceID('');
        setAudioUrl('');
        setSelectedName('');
        dispatch(setVoice(''));
        dispatch(setVoiceId(''));
        dispatch(setVoiceLanguage(''));
      }
    }
  }, [selectedLanguage, dispatch, setSelectedVoiceID]);

  // Update Redux store and UI when selectedVoiceID changes
  useEffect(() => {
    if (selectedVoiceID && voiceList) {
      const voice = voiceList.find((voice) => voice.voiceid === selectedVoiceID);
      if (voice) {
        setSelectedVoice(voice.voiceid);
        setSelectedName(voice.voice);
        setAudioUrl(voice.preview);
        dispatch(setVoice(voice.voice));
        dispatch(setVoiceId(selectedVoiceID));
        dispatch(setVoiceLanguage(voice.language_id));
      }
    }
  }, [selectedVoiceID, voiceList, dispatch]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voiceList?.find((voice) => voice.voiceid === e.target.value);
    if (voice) {
      setSelectedVoice(e.target.value);
      setAudioUrl(voice.preview);
      setSelectedName(voice.voice);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handleSelectVoice = () => {
    setSelectedVoiceID(selectedVoice);
    setSubAudioUrl(audioUrl);
    const voice = voiceList?.find((voice) => voice.voiceid === selectedVoice);
    if (voice) {
      dispatch(setVoice(voice.voice));
      dispatch(setVoiceId(selectedVoice));
      dispatch(setVoiceLanguage(voice.language_id));
      setSelectedName(voice.voice);
    }
  };

  const handleGenerateSpeech = async () => {
    if(isDisabled) return toast.error('Please wait while data loads!');
    if (!selectedVoiceID) {
      toast.error('Please select a voice to proceed');
      return;
    }
    dispatch(setLoader({ loading: true,status: 'please wait while we generate speech',percentage: 0 }));
    setLoading(true);
    const payload = {
      batchid: generateRandomString(),
      video: url,
      voices: [],
    };

    const subtitlesArr = subtitles?.data;
    for (const item of subtitlesArr) {
      const audioObj = {
        audioid: generateRandomString(6),
        audio: '',
        start_time: getSecondsFromTime(item.start_time),
        end_time: getSecondsFromTime(item.end_time),
      };
      const audio_url = await textToSpeech({ voiceid: selectedVoiceID, text: item.text });
      if (audio_url) audioObj.audio = audio_url;
      else continue;
      payload.voices.push(audioObj);
    }

    if (payload.voices.length) {
      try {
        dispatch(setLoader({ loading: true,status: 'please wait while we generate speech',percentage: 0 }));
        const res = await mergeAudio(payload);
        setMergeToken(res?.token ?? '');
      } catch (err) {
        console.log('error',err)
        setLoading(false);
        toast.error('Error in merging audio');
      }
      finally{
        dispatch(setLoader({ loading: false,status: 'please wait while we generate speech',percentage: 0 }));
      }
    } else {
      setLoading(false);
      toast.error('No valid audio generated for subtitles');
    }
  };

  useEffect(() => {
    if (mergeToken) {
      getMergeVideo(mergeToken);
    }
  }, [mergeToken]);

  const getMergeVideo = async (request_id: string) => {
    if (request_id) {
      const interval = setInterval(async () => {
        try {
          const res = await mergeAudioProgress({ token: request_id });
          if (res?.status?.toLowerCase() === 'completed') {
            clearInterval(interval);
            const data = res?.result?.video_url;
            if (data?.error) {
              toast.error(data?.error);
              setLoading(false);
              return;
            }
            dispatch(setVideoUrl(data));
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          clearInterval(interval);
          toast.error('Error checking merge progress');
        }
      }, 5000);
      setMergeToken('');
    }
  };

  return (
    <div className="w-full border-b-[1px] border-[#303032] flex items-center justify-between px-2 relative">
      {showReplace && <FindAndReplaceComponent setShowReplace={setShowReplace} subtitle={true} />}
      <div className="change_voice">
        <div className="flag_user">
          <p className="mb-0 text-[12px] text-[#f9fbfc] font-semibold">{selectedName}</p>
          <button
            className="text-[10px] text-[#a3a3a5] cursor-pointer flex items-center gap-2"
            onClick={() => {
              if(isDisabled) return toast.error('Please wait while data loads!');
              document.getElementById('change_language_modal')?.showModal()
            }}
          >
            {selectedName ? 'Change Voice' : 'Select Voice'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="tooltip tooltip-left" data-tip="Find and Replace">
            <MdFindReplace
              size={18}
              color="#dfdfdf"
              className="cursor-pointer"
              onClick={() => setShowReplace(!showReplace)}
            />
          </div>
          <button className="generate_button" onClick={handleGenerateSpeech}>
            {loading ? (
              <span className="font-light">
                <span className="loading loading-dots loading-sm"></span> Generating
              </span>
            ) : (
              <>Generate Speech</>
            )}
          </button>
        </div>
      </div>
      <dialog id="change_language_modal" className="modal chhange_modal">
        <div className="modal-box p-[30px] bg-[#16151a] w-4/10 max-w-5xl rounded-2xl">
          <div className="modal-action mt-0">
            <form method="dialog" className="flex w-full flex-col gap-2">
              <div className="w-full flex justify-between border-b pb-4 border-b-[#303032]">
                <h4 className="text-xl font-semibold text-[#ffffff]">Change Voice</h4>
                <button className="cursor-pointer w-[25px] h-[25px] flex justify-center items-center rounded-full text-[#ffffff] text-xl">
                  <IoClose />
                </button>
              </div>
              <div className="flex mt-5 gap-3 items-center justify-between">
                <div className="flex w-1/2 flex-col">
                  <span className="text-[12px] text-[#a3a3a5]">Select Language</span>
                  <select
                    className="mt-2 px-2 py-3 text-xs outline-none rounded-md border-[#303032] text-[#a3a3a5] cursor-pointer dd_bg_op disabled:bg-slate-600 disabled:cursor-not-allowed"
                    onChange={handleLanguageChange}
                    disabled={isPlaying}
                    value={selectedLanguage || ''}
                  >
                    {languageList?.map((item) => (
                      <option key={item.language_id} value={item.language_id} className="block">
                        {item.language}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-1/2 gap-5">
                  <div className="flex flex-col w-full">
                    <span className="text-[12px] text-[#a3a3a5]">Select Voice</span>
                    <select
                      className="mt-2 px-2 py-3 text-xs rounded-md outline-none border-[#303032] text-[#a3a3a5] cursor-pointer dd_bg_op disabled:bg-slate-600 disabled:cursor-not-allowed"
                      onChange={handleVoiceChange}
                      disabled={isPlaying}
                      value={selectedVoice}
                    >
                      {voiceList?.map((item, index) => (
                        <option key={item.voiceid + index} value={item.voiceid}>
                          {item.voice}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <audio ref={audioRef} src={audioUrl} />
                  {isPlaying ? (
                    <IoPauseOutline size={24} className="text-[#ccc] cursor-pointer" onClick={toggleAudio} />
                  ) : (
                    <IoPlayOutline size={24} className="text-[#ccc] cursor-pointer" onClick={toggleAudio} />
                  )}
                </div>
              </div>
              <button
                className="bg-[#422ad5] cursor-pointer text-[#ffffff] py-3 font-semibold text-[14px] rounded-md border-[#303032] border mt-5"
                onClick={handleSelectVoice}
              >
                Select Voice
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SubtitleHeader;