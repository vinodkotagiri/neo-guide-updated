// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { BsTranslate } from 'react-icons/bs'
import { MdSettingsVoice } from "react-icons/md";
import { GrLanguage } from 'react-icons/gr'
import { languagesWithVoice } from '../../constants';
import toast from 'react-hot-toast';
import { getProgress, getSubtitles, translateAndDub } from '../../api/axios';
import { useAppSelector } from '../../redux/hooks';
import { setLoaderData } from '../../redux/features/loaderSlice';
import { useDispatch } from 'react-redux';
import { setVideoUrl } from '../../redux/features/videoSlice';

function EditorLeftTopBar({ setDub }) {
  const dispatch = useDispatch()
  const [operation, setOperation] = useState(1);
  const [lang, setLang] = useState(null)
  const [voice, setVoice] = useState(null)
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [availableVoices, setAvailableVoices] = useState([])
  const [requestId, setRequestId] = useState('')
  const { url } = useAppSelector(state => state.video)
  useEffect(() => {
    const languageList = [...languagesWithVoice]
    setAvailableLanguages(languageList);
  }, [])

  useEffect(() => {
    setLang(availableLanguages[0]?.language)
  }, [availableLanguages])

  useEffect(() => {
    if (lang) {
      const voices = availableLanguages.find((item) => item.language === lang)?.voices
      setAvailableVoices(voices)
    }
  }, [lang, availableLanguages])


  async function handleTranslataAndDub() {
    if (operation == 1) {
      if (lang && voice) {
        const response = await translateAndDub({ target_language: lang, voice: voice, s3_link: url })
        if (response?.request_id) {
          // dispatch(setLoader({loading:true}))
          setDub(true)
          const progessInterval = setInterval(() => {
            getProgress(response?.request_id).then(res => {
              if (res?.status?.toLowerCase() == 'completed') {
                clearInterval(progessInterval)
                dispatch(setVideoUrl( res?.result?.dubbed_video_url));
                setDub(false)
              } else if (res?.status?.toLowerCase().includes('error')) {
                clearInterval(progessInterval)
                setDub(false)
                toast.error(JSON.stringify(res?.status?.toLowerCase()));
              }

              else {
                dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
              }
            })
          }, 5000)
        } else {
          setDub(false)
          toast.error('Error dubbing/translating video');
        }
      } else if (!lang) {
        return toast.error('Please select a language')
      } else if (!voice) {
        return toast.error('Please select a voice')
      }
    }

    if(operation==2){
      if (lang) {
        const response = await getSubtitles({ target_language: lang, video_path: url })
        if (response?.request_id) {
          // dispatch(setLoader({loading:true}))
          setDub(true)
          const progessInterval = setInterval(() => {
            getProgress(response?.request_id).then(res => {
              if (res?.status?.toLowerCase() == 'completed') {
                clearInterval(progessInterval)
                const data = res?.result;
                const s3Url=data.split(': ')[1]
                dispatch(setVideoUrl(s3Url))
                console.log('data:::', data)
                // dispatch(setArticleData(data))
                setDub(false)
              } else if (res?.status?.toLowerCase().includes('error')) {
                clearInterval(progessInterval)
                setDub(false)
                toast.error(JSON.stringify(res?.status?.toLowerCase()));
              }

              else {
                dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
              }
            })
          }, 5000)
        } else {
          setDub(false)
          toast.error('Error dubbing/translating video');
        }
      } else if (!lang) {
        return toast.error('Please select a language')
      } else if (!voice) {
        return toast.error('Please select a voice')
      }
    }

  }


  return (
    <div className='w-full h-[72px] border-slate-700 border-b-[1px] flex items-center px-4 p-2 gap-2'>
      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
        <BsTranslate size={32} color='#9810FA' />
        <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={1} value={operation} onChange={(e) => setOperation(parseInt(e.target.value))}>
          <option value={1}>Translate & Dub</option>
          <option value={2}>Sub-titles</option>
        </select>
      </div>

      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
        <GrLanguage size={32} color='#9810FA' />
        <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'languages'} onChange={(e) => setLang(e.target.value)}>
          <option value={'languages'} disabled>Language</option>
          {availableLanguages.map((lang, index) => <option key={index} value={lang.language}>{lang.language}</option>)}
        </select>
      </div>

      {operation == 1 && <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
        <MdSettingsVoice size={32} color='#9810FA' />
        <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'voices'} onChange={(e) => {
          console.log('e.target.value', e.target.value)
          setVoice(e.target.value)
        }}>
          <option value={'voices'} disabled>Voice</option>
          {availableVoices.map((voice, index) => <option key={index} value={voice}>{voice}</option>)}
        </select>
      </div>}
      <button className='btn text-white shadow-none border-none btn-lg bg-slate-900 ' onClick={handleTranslataAndDub}>GO</button>
    </div>
  )
}

export default EditorLeftTopBar