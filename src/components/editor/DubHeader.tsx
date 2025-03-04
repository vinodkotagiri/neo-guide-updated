//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { languages } from '../../constants'
import { IoIosMic } from "react-icons/io";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getProgress, translateAndDub } from '../../api/axios';
import { setLoader, setLoaderData } from '../../redux/features/loaderSlice';

function DubHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState({})
  const [languageList, setLanguageList] = useState([])
  const [selectedVoice, setSelectedVoice] = useState({})
  const { url } = useAppSelector(state => state.video)
  const [requestId,setRequestId]=useState('')
  const dispatch=useAppDispatch()
  useEffect(() => {
    setSelectedLanguage(languages[0])
    setLanguageList(languages.map(lang => Object.keys(lang)[0]))
  }, [])

  useEffect(() => {
    if (Object.keys(selectedLanguage).length) {
      const voices = Object.values(selectedLanguage)[0]?.voices
      setSelectedVoice(voices[0])
    }

  }, [selectedLanguage])

  function handleLanguageChange(e) {
    setSelectedLanguage(languages[e.target.value])
    console.log('languages[e.target.value]:', Object.values(languages[e.target.value])[0].value)
  }
  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value)
  }

  function handleDubChange() {
    console.log('selectedLanguage:',Object.values(selectedLanguage)[0].value )
    if(Object.values(selectedLanguage)[0].value){
      const payload = {
        s3_link: url,
        target_language: Object.values(selectedLanguage)[0].value.split('-')[0],
        voice: selectedVoice.value.split('-')[0]
      }
      console.log('payload:',payload)
      translateAndDub(payload).then(res => setRequestId(res?.request_id??''))
    }
  }

  useEffect(()=>{
    getArticleData(requestId)
  },[requestId])

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLoader({ loading: true }))
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            console.log('res:',res)

            // if (data) {

            // }
            dispatch(setLoader({ loading: false }))
          } else if (res?.status?.toLocaleLowerCase().includes('failed')) {
            clearInterval(progessInterval)
            dispatch(setLoader({ loading: false }))
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
      <button className="btn" onClick={() => document.getElementById('change_language_modal').showModal()}>Change Voice</button>
      <dialog id="change_language_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <div className='flex items-center justify-center gap-2'>
                <div className='flex btn bg-transparent  shadow-none outline-none border-none w-content text-blue-400'>
                  <div><span className='text-xl'>{Object.values(selectedLanguage)[0]?.flag}</span></div>
                  <select className=' bg-transparent w-[180px] text-xs hovr:outline-none h-full outline-none border-none  text-slate-500  cursor-pointer' onChange={handleLanguageChange} value={selectedVoice.voice}>
                    {languageList.map((item, index) => <option key={index} value={index} className='block' >{item}</option>)}
                  </select>
                </div>

              </div>

              <div className='flex gap-1 items-center justify-center text-xs font-semibold text-blue-500'>
                <IoIosMic size={24} />
                <select className='bg-transparent   h-full outline-none border-none cursor-pointer' onChange={handleVoiceChange}>
                  {Object.values(selectedLanguage)[0]?.voices.map(item => (<option key={item.value} value={item}>{item.voice}</option>))}
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