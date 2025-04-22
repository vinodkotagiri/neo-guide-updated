//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getLanguages, getProgress, getVoiceForLanguage, translateAndDub } from '../../api/axios';
import {  setLoaderData } from '../../redux/features/loaderSlice';
import { setVideoUrl } from '../../redux/features/videoSlice';
import { FadeLoader } from 'react-spinners';
import Flag from 'react-world-flags'
import { IoClose } from 'react-icons/io5';
import {MdFindReplace, MdClose} from 'react-icons/md'
import FindAndReplaceComponent from './FindAndReplaceComponent';
function DubHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [languageList, setLanguageList] = useState([])
  const [voiceList, setVoiceList] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const { url } = useAppSelector(state => state.video)
  const [requestId, setRequestId] = useState('')
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [showReplace, setShowReplace] =useState(false)


  useEffect(() => {
    getLanguages().then(languages=>setLanguageList(languages))
    setLanguageList()
  }, [])

useEffect(()=>{
  if(selectedLanguage?.language_id)
  getVoiceForLanguage(selectedLanguage.language_id).then(voices=>setVoiceList(voices))
},[selectedLanguage])

  function handleLanguageChange(e) {
    setSelectedLanguage(e.target.value)
  }
  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value)
  }



  function handleDubChange() {

    if (selectedLanguage && selectedVoice) {
      const payload = {
        s3_link: url,
        target_language: selectedLanguage,
        voice: selectedVoice
      }
      translateAndDub(payload).then(res => setRequestId(res?.request_id ?? ''))
    }
  }
  useEffect(() => {
    getArticleData(requestId)
  }, [requestId])

  async function getArticleData(request_id) {
    if (request_id) {
      setLoading(true)
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            const data = res?.result
            if (data) {
              const url = data?.dubbed_video_url;
              if (url) {
                dispatch(setVideoUrl(url));
              }
            }
            setLoading(false)
          } else if (res?.status?.toLocaleLowerCase().includes('failed')) {
            clearInterval(progessInterval)
            setLoading(false)
            toast.error(res?.status)
          }
          else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    }
  }

  return (
    <div className='w-full border-b-[1px] border-slate-600 flex items-center justify-between px-2 relative'>
     {showReplace && <FindAndReplaceComponent setShowReplace={setShowReplace}/>}
      <div className='change_voice'>
        <div className='flag_user'>
          <div className='flag_icon'>
            <Flag code="IN" /></div>
          <p className='mb-0 text-[18px] text-[#f9fbfc] font-semibold '>Suman</p>
        </div>
        <div className='tooltip' data-tip='Find and Replace'>
        {showReplace?<MdClose size={24} color='#ff000095' className='cursor-pointer' onClick={() => setShowReplace(!showReplace)}/>:<MdFindReplace size={24} color='#dfdfdf' className='cursor-pointer' onClick={() => setShowReplace(!showReplace)}/>}
        </div>
        <button onClick={() => document.getElementById('change_language_modal').showModal()}>Change Voice {loading && <span className=''> <FadeLoader size={100} /></span>}
        </button>
      </div>
      <dialog id="change_language_modal" className="modal chhange_modal">
        <div className="modal-box p-[30px] bg-[#16151a] w-4/12 max-w-5xl rounded-2xl">
          <div className="modal-action mt-0">

            <form method="dialog" className='flex w-full flex-col gap-2 '>
              <div className="w-full flex justify-between border-b pb-4 border-b-[#303032]">
                <h4 className='text-xl font-semibold text-[#fff]  '>Change Voice</h4>
                <button className="  cursor-pointer  w-[25px] h-[25px] flex justify-center items-center rounded-full text-[#fff]  text-xl"><IoClose /></button>
              </div>
              <div className='flex  flex-col mt-5 gap-3'>
                <div className='flex w-full flex-col  '>
                  {/* <div><span className='text-xl'>{Object.values(selectedLanguage)[0]?.flag}</span></div> */}

                  <span className="text-[12px] text-[#a3a3a5] ">Select Language</span>
                  <select className='mt-2  px-2  py-3  text-xs outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op' onChange={handleLanguageChange} value={selectedLanguage.language}>
                    {languageList.map((item) => <option key={item.language_id} value={item.language_id} className='block' >{item.language}</option>)}
                  </select>

                </div>

                <div className='flex gap-5 mt-4'>
                  {/* <div className='flex flex-col w-1/2'>
                    <span className="text-[12px] text-[#a3a3a5] ">Select Gender</span>
                    <select className='mt-2 px-2  py-3 text-xs    rounded-md    outline-none    border-[#303032]   text-[#a3a3a5]  cursor-pointer ' onChange={handleGenderChange}>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div> */}

                  <div className='flex flex-col w-1/2'>
                    <span className="text-[12px] text-[#a3a3a5] ">Select Voice</span>
                    <select className='mt-2 px-2  py-3  text-xs       rounded-md    outline-none  border-[#303032]   text-[#a3a3a5]  cursor-pointer' onChange={handleVoiceChange}>
                      {voiceList.map(item => (<option key={item} value={item.voiceid}>{item}</option>))}
                    </select>
                  </div>
                </div>
              </div>
              <button className="bg-[#422ad5] cursor-pointer text-[#fff] py-3 font-semibold text-[14px] rounded-md  border-[#303032]  border mt-5" onClick={handleDubChange}>Generate Voice</button>

            </form>
          </div>
        </div>
      </dialog>

    </div>
  )
}

export default DubHeader