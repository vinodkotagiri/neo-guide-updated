//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { dubLanguages } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getProgress, translateAndDub } from '../../api/axios';
import { setLoaderData } from '../../redux/features/loaderSlice';
import { setVideoUrl } from '../../redux/features/videoSlice';
import Flag from 'react-world-flags'
import { IoClose } from 'react-icons/io5';
import { MdFindReplace } from 'react-icons/md'
import FindAndReplaceComponent from './FindAndReplaceComponent';
import spinner from '../../assets/images/fade-stagger-circles.svg'
function SubtitleHeader() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [languageList, setLanguageList] = useState([])

  const [voiceList, setVoiceList] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const { url } = useAppSelector(state => state.video)
  const [requestId, setRequestId] = useState('')
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [showReplace, setShowReplace] = useState(false)

  useEffect(() => {
    setLanguageList(dubLanguages)
  }, [])


  function handleLanguageChange(e) {
    setSelectedLanguage(e.target.value)
  }
  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value)
  }


  useEffect(() => {
    console.log('selectedLanguage,selectedLanguage', selectedLanguage)
    if (selectedLanguage) {
      const lang = dubLanguages.find((item) => item.code == selectedLanguage)
      const voices = lang.voices
      console.log('voices', voices, selectedLanguage)
      setVoiceList(voices)
      setSelectedVoice(voices[0])
    }
  }, [selectedLanguage])
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
    <div className='w-full border-b-[1px] border-[#303032] flex items-center justify-between px-2 relative'>
      <div className='change_voice'>
        <div className='flag_user'>
          <div className='flag_icon'>
            <Flag code="IN" /></div>
          <p className='mb-0 text-[18px] text-[#f9fbfc] font-semibold '>Suman</p>
        </div>
        <div className='flex items-center gap-2 '>
          <button className='generate_button '  > Generate Speech
          </button>
        </div>
      </div>
     
    </div>
  )
}

export default SubtitleHeader