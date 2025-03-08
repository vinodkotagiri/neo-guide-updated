//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { languages } from '../../constants'
import { IoIosMic } from "react-icons/io";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getProgress, translateAndDub } from '../../api/axios';
import { setLoader, setLoaderData } from '../../redux/features/loaderSlice';
import { setVideoUrl } from '../../redux/features/videoSlice';
import { TbGenderIntergender } from 'react-icons/tb';
import {     FadeLoader} from 'react-spinners'
function DubHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [languageList, setLanguageList] = useState([])
  const [gender, setGender] = useState('Male')
  const [voiceList, setVoiceList] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const { url } = useAppSelector(state => state.video)
  const [requestId, setRequestId] = useState('')
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLanguageList(Object.keys(languages).map((item) => item))
    setSelectedLanguage("English")
  }, [])



  function handleLanguageChange(e) {
    setSelectedLanguage(e.target.value)
  }
  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value)
  }

  function handleGenderChange(e) {
    setGender(e.target.value)
  }

  useEffect(() => {
    if (selectedLanguage) {
      let voices = languages[selectedLanguage]
      voices = voices[gender.toLowerCase()]
      setVoiceList(voices)
    }
  }, [gender, selectedLanguage, languages])

  function handleDubChange() {
    if (selectedLanguage && selectedVoice) {
      console.log('onisooo')
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
    <div className='w-full border-b-[1px] border-slate-600 flex items-center justify-between px-2'>
      <button className="btn" onClick={() => document.getElementById('change_language_modal').showModal()}>Change Voice {loading&&<span className=''><FadeLoader size={100}/></span>} </button>
      <dialog id="change_language_modal" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog"className='flex w-full flex-col gap-2 p-4'>
              <div className='flex items-center justify-center gap-2'>
                <div className='flex btn bg-transparent  shadow-none outline-none border-none w-content text-blue-400'>
                 {/* <div><span className='text-xl'>{Object.values(selectedLanguage)[0]?.flag}</span></div> */}
                  <select className=' bg-transparent w-[180px] text-xs hovr:outline-none h-full outline-none border-none  text-slate-500  cursor-pointer' onChange={handleLanguageChange} value={selectedVoice.voice}>
                    {languageList.map((item, index) => <option key={index} value={item} className='block' >{item}</option>)}
                  </select>
                </div>

              </div>
              <div className='flex gap-1 items-center justify-center text-xs font-semibold text-blue-500'>
                <TbGenderIntergender size={24} />
                <select className='bg-transparent   h-full outline-none border-none cursor-pointer' onChange={handleGenderChange}>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              </div>

              <div className='flex gap-1 items-center justify-center text-xs font-semibold text-blue-500'>
                <IoIosMic size={24} />
                <select className='bg-transparent   h-full outline-none border-none cursor-pointer' onChange={handleVoiceChange}>
                  {voiceList.map(item => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <button className="btn" onClick={handleDubChange}>Generate Voice</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

    </div>
  )
}

export default DubHeader