//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { elvenLanguages, elvenVoices } from '../../constants/index.ts'
import Flag from 'react-world-flags'
import { IoClose, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
// import { MdFindReplace } from 'react-icons/md'
// import FindAndReplaceComponent from './FindAndReplaceComponent';
import spinner from '../../assets/images/fade-stagger-circles.svg'
function SubtitleHeader({selectedVoiceID,setSelectedVoiceID,setSubAudioUrl}) {
  const [selectedLanguage, setSelectedLanguage] = useState()
  const [languageList, setLanguageList] = useState()
  const [voiceList, setVoiceList] = useState()
  const [selectedVoice, setSelectedVoice] = useState('')
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedName,setSelectedName]=useState('')
  const [audioUrl,setAudioUrl]=useState('')

  useEffect(() => {
    setLanguageList(elvenLanguages)
    setSelectedLanguage(elvenLanguages[0].language_id)
    const voices=elvenVoices.find(voice => voice.language_id == elvenLanguages[0].language_id)
    setVoiceList(voices?.voices)
    setSelectedVoice(voices?.voices[0].voiceid)
    setAudioUrl(voices?.voices[0].preview)
  }, [])

  useEffect(() => {
    if (selectedLanguage)
      setVoiceList(elvenVoices.find(voice => voice.language_id == selectedLanguage)?.voices)
    setSelectedVoiceID('')
  }, [selectedLanguage])
  function handleLanguageChange(e) {
    setSelectedLanguage(e.target.value)
  }
  
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

  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value)
    const voice=voiceList.find(voice=>voice.voiceid==e.target.value)
    setAudioUrl(voice.preview)
  }
  useEffect(()=>{
    if(selectedVoiceID){
      const voice=voiceList?.find(voice=>voice.voiceid==selectedVoiceID)
      setSelectedName(voice?.voice)
    }

  },[selectedVoiceID,voiceList])

  function handleSelectVoice(){
    setSelectedVoiceID(selectedVoice)
    setSubAudioUrl(audioUrl)
  }
console.log(selectedVoice)
  return (
    <div className='w-full border-b-[1px] border-[#303032] flex items-center justify-between px-2 relative'>
      <div className='change_voice'>
        <div className='flag_user'>
           {/*<div className='flag_icon'>
            <Flag code="US" /></div> */}
          <p className='mb-0 text-[18px] text-[#f9fbfc] font-semibold '>{selectedName}</p>
          <button className='text-[12px] text-[#a3a3a5] cursor-pointer flex items-center gap--2 ' onClick={() => document.getElementById('change_language_modal').showModal()}>{selectedName?'Change Voice':"Select Voice"}
          </button>
        </div>
        <div className='flex items-center gap-2 '>
          <button className='generate_button '  > Generate Speech
          </button>
        </div>
      </div>
      <dialog id="change_language_modal" className="modal chhange_modal">
        <div className="modal-box p-[30px] bg-[#16151a] w-4/10 max-w-5xl rounded-2xl">
          <div className="modal-action mt-0">

            <form method="dialog" className='flex w-full flex-col gap-2 '>
              <div className="w-full flex justify-between border-b pb-4 border-b-[#303032]">
                <h4 className='text-xl font-semibold text-[#fff]  '>Change Voice</h4>
                <button className="  cursor-pointer  w-[25px] h-[25px] flex justify-center items-center rounded-full text-[#fff]  text-xl"><IoClose /></button>
              </div>
              <div className='  flex   mt-5 gap-3 items-center justify-between'>
                <div className='flex  w-1/2  flex-col  '>
                  <span className="text-[12px] text-[#a3a3a5] ">Select Language</span>
                  <select className='mt-2  px-2  py-3  text-xs  outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op' onChange={handleLanguageChange} value={selectedLanguage}>
                    {languageList?.length && languageList.map((item) => <option key={item.language_id} value={item.language_id} className='block' >{item.language}</option>)}
                  </select>
                </div>
                <div className='flex w-1/2 gap-5 '>
                  <div className='flex flex-col w-full'>
                    <span className="text-[12px] text-[#a3a3a5] ">Select Voice</span>
                    <select className='mt-2 px-2  py-3  text-xs rounded-md    outline-none  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op' onChange={handleVoiceChange} value={selectedVoice}>
                      {voiceList?.length && voiceList.map((item,index) => (<option key={item.voiceid+index} value={item.voiceid}>{item.voice}</option>))}
                    </select>
                  </div>
                </div>
                <div className='mt-5'>
                  <audio ref={audioRef} src={audioUrl} />
                  {isPlaying ? (
                    <IoPauseOutline
                      size={24}
                      className='text-[#ccc] cursor-pointer'
                      onClick={toggleAudio}
                    />
                  ) : (
                    <IoPlayOutline
                      size={24}
                      className='text-[#ccc] cursor-pointer'
                      onClick={toggleAudio}
                    />
                  )}
                </div>
              </div>
              <button className="bg-[#422ad5] cursor-pointer text-[#fff] py-3 font-semibold text-[14px] rounded-md  border-[#303032]  border mt-5" onClick={handleSelectVoice}>Select Voice</button>

            </form>
          </div>
        </div>
      </dialog>

    </div>
  )
}

export default SubtitleHeader