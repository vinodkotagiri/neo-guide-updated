/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import SubtitleHeader from './SubtitleHeader'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getSecondsFromTime } from '../../helpers'
import { getLanguages, getProgress, getSubtitles, getVoiceForLanguage, mergeAudio, mergeAudioProgress, textToSpeech } from '../../api/axios'
import toast from 'react-hot-toast'
import { setLocked, setVideoUrl, updateRetries, updateSubtitleData } from '../../redux/features/videoSlice'
import { setLoaderData } from '../../redux/features/loaderSlice'
import LocalLoader from '../global/LocalLoader'
import { FaPlayCircle } from 'react-icons/fa'
import { IoClose, IoEyeOutline, IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import { mergeAudioPayload, mergeAudioResponse } from '../../api/payloads/payloads'
import { MdPlayCircleFilled } from 'react-icons/md'
function SubtitleAreaComponent({ playerRef }) {
  const { subtitles, played, url, retries } = useAppSelector(state => state.video)
  const { percentage, status } = useAppSelector(state => state.loader)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [reqId, setReqId] = useState('')
  const dispatch = useAppDispatch()
  const { currentPlayTime } = useAppSelector(state => state.video)
  const containerRef = useRef(null)
  const [previewItem, setPreviewItem] = useState(null)
  const [languages, setLanguages] = useState([])
  const [voices, setVoices] = useState([])
  const [selectedLanguage, setSelectedLaguage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('xyz')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  // Spring animation for smooth scrolling
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 20,
  })
  console.log('currentPlayTime', currentPlayTime)
  useEffect(() => {
    getLanguages().then((res) => setLanguages(res))
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      getVoiceForLanguage(selectedLanguage).then(res => {
        setVoices(res)
        setSelectedVoice(res[0])
      })
    }
  }, [selectedLanguage])


  function handlePreviewAudio() {
    if (selectedVoice && previewItem?.text) {
      const data = {
        voice: selectedVoice,
        text: previewItem?.text
      }
      textToSpeech(data).then(res => {
        if (res?.audio_url) {
          audioRef.current.src = res?.audio_url
          audioRef.current.play()
          setAudioUrl(res?.audio_url)
        }
      })
    }
  }

  async function handleGenerate() {
    if (audioUrl && previewItem && url) {
      const payload: mergeAudioPayload = {
        batchid: Date.now().toString(),
        video: url,
        voices: [{ audioid: (Date.now() * 2).toString(), audio: audioUrl, start_time: previewItem?.start_time, end_time: previewItem?.end_time }]
      }
      await mergeAudio(payload)
        .then((res: mergeAudioResponse) => {
          if (res.token) {
            setToken(res.token)
          }
        })
    }
  }

  useEffect(() => {
    if (token) {
      setLoading(true)
      const progressInterval = setInterval(() => {
        mergeAudioProgress({ token }).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progressInterval)
            if (res?.video_url) {
              if (url) {
                dispatch(setVideoUrl(res.video_url))
              }
            }
            setLoading(false)
            setPreviewItem(null)
          }
        }).catch(err => {
          console.log('error in generating audio', err)
          setLoading(false)
          setPreviewItem(null)
        })
      }, 5000)
    }
  }, [token])

  function handlePreviewSubtitle(e, item) {
    e.preventDefault()
    e.stopPropagation()
    setPreviewItem(item)
    document.getElementById('subtitle_audio_preview_modal').showModal()
  }

  useEffect(() => {
    const idx = subtitles.data.findIndex((subtitle) => {
      return getSecondsFromTime(subtitle.start_time) - 1 <= currentPlayTime && getSecondsFromTime(subtitle.end_time) - 1 >= currentPlayTime
    })
    if (currentIdx != idx) setCurrentIdx(idx)
  }, [currentPlayTime])


  console.log(currentPlayTime, currentIdx)
  // Animate scroll when currentIdx changes
  useEffect(() => {
    if (currentIdx >= 0 && containerRef.current) {
      const subtitleHeight = 96 // h-24 in tailwind is 6rem or 96px
      const containerHeight = containerRef.current.clientHeight
      const targetScroll = currentIdx * subtitleHeight - (containerHeight / 2) + (subtitleHeight / 2)
      spring.set(Math.max(0, targetScroll))
    }
  }, [currentIdx])

  useEffect(() => {
    if (!subtitles.data.length && retries < 3) {
      getSubtitles({ target_language: 'en', video_path: url }).then((res) => {
        const request_id = res?.request_id;
        if (request_id) {
          setReqId(request_id);
        }
      })
        .catch(() => {
          toast.error('Error uploading video');
          dispatch(setLocked(false))
        })
        .finally(() => {
          dispatch(setLocked(false))
        });
    }
  }, [])

  useEffect(() => {
    if (reqId) {
      getArticleData(reqId)
    }
  }, [reqId])

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLocked(true))
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            const data = res?.result?.subtitles;
            if (data?.error) {
              dispatch(setLocked(false))
              dispatch(updateSubtitleData([]))
              dispatch(updateRetries())
              return toast.error(data?.error)
            }
            dispatch(updateSubtitleData(data))
            dispatch(setLocked(false))
          } else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    }
  }

  function isActiveStyle(start, end) {
    const startSeconds = getSecondsFromTime(start)
    const endSeconds = getSecondsFromTime(end)
    if (startSeconds <= played && endSeconds >= played) {
      return true
    }
    return false
  }
  console.log('languages', languages)
  return (
    <div className='w-full h-full  mb--2' ref={containerRef}>
      <dialog id="subtitle_audio_preview_modal" className="modal chhange_modal">
        <div className="modal-box p-[30px]  bg-[#16151a] w-4/12 max-w-5xl rounded-2xl ">
          <form method="dialog">
            <div className='flex w-full gap-2 flex-col'>
              <div className="w-full flex justify-between border-b pb-4 border-b-[#303032]">
                <h4 className='text-xl font-semibold text-[#fff] '>Language</h4>
                <button className="  cursor-pointer  w-[25px] h-[25px] flex justify-center items-center rounded-full text-[#fff]  text-xl"><IoClose /></button>
              </div>
              <div className='flex justify-between gap-3'>
                <fieldset className="fieldset">
                  <span className="text-[12px] text-[#a3a3a5] ">Select Language</span>
                  <select defaultValue="Pick a browser" className="mt-2  px-2  py-3  text-xs     outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op" onChange={(e) => setSelectedLaguage(e.target.value)} >
                    <option disabled={true}>Select a Language</option>
                    {languages.map((item, index) => <option key={index} value={item}>{item.split('-')[0]}</option>)}
                  </select>
                </fieldset>

                {selectedLanguage && voices.length ?
                  <fieldset className="fieldset grow">
                    <span className="text-[12px] text-[#a3a3a5] ">Select Voice</span>
                    <div className='flex justify-between gap-3'>
                      <select defaultValue="Pick a browser" className="grow mt-2  px-2  py-3  text-xs     outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op" onChange={e => setSelectedVoice(e.target.value)}>
                        <option disabled={true}>Select a Voice</option>
                        {voices.map((item, index) => <option key={index} value={item}>{item.split('-')[0]}</option>)}
                      </select>
                      <div className='flex items-center gap-2'>
                        <div className="cursor-pointer " onClick={handlePreviewAudio}>
                          <MdPlayCircleFilled size={32} className='text-[#a3a3a5]' />
                        </div>
                        <audio ref={audioRef} src={previewItem?.audio} controlsList="nodownload nofullscreen" />
                      </div>
                    </div>
                  </fieldset> : ''}
              </div>
            </div>

            {/*  <div className='w-full flex justify-between mt-6 items-center gap-2'>

              {audioUrl ? <fieldset className="fieldset">
                <div className="btn btn-success" onClick={handleGenerate}>Generate</div>
              </fieldset> : ''}
              <button className="btn">Close</button>
            </div> */}

          </form>
        </div>
      </dialog>
      <SubtitleHeader />

      <motion.div
        className='flex flex-col gap-1 p-2 h-[93%] overflow-auto'
        style={{ translateY: -spring }} // Use the spring value directly with negation
      >
        {!subtitles.data.length ?
          <div className='w-full h-full overflow-auto relative'>
            <LocalLoader progress={percentage} text={status} />
          </div>
          :
          subtitles.data.map((item, index) => {
            return (
              <motion.div
                className='flex h-24 items-center justify-between gap-1 cursor-pointer bg-[#212025] rounded-md'
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={currentIdx === index && isActiveStyle(item.start_time, item.end_time) ? {
                  color: '#fff',
                  backgroundColor: '#422AD5'
                } : {}}
                onClick={() => {
                  // setCurrentIdx(index)
                  playerRef.current.seekTo(getSecondsFromTime(item.start_time))
                }}
              >
                <div className='flex flex-col h-full items-center justify-center px-2 gap-1'>
                  <div className='text-[#ccc] text-[0.8rem]'>{item?.start_time?.split(',')[0]}</div>
                  <div className='text-[#ccc] text-[0.8rem]'>{item?.end_time?.split(',')[0]}</div>
                </div>
                <p
                  className='w-full h-auto p-2 py-3 text-[#ccc] subtitle-content text-[0.8rem] outline-0'
                  dangerouslySetInnerHTML={{ __html: item.text }}
                  contentEditable
                />
                {/* <IoEyeOutline size={24} className='mx-4 text-[#ccc]' onClick={(e) => handlePreviewSubtitle(e, item)} /> */}
                <IoPlayOutline size={24} className='mx-4 text-[#ccc]' />
                <IoPauseOutline size={24} className='mx-4 text-[#ccc]' />

              </motion.div>
            )
          })
        }
      </motion.div>
    </div>
  )
}

export default SubtitleAreaComponent
