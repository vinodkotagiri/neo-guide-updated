//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import SubtitleHeader from './SubtitleHeader'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getSecondsFromTime } from '../../helpers'
import { getLanguages, getProgress, getSubtitles, getVoiceForLanguage, textToSpeech } from '../../api/axios'
import toast from 'react-hot-toast'
import { setLocked, updateRetries, updateSubtitleData } from '../../redux/features/videoSlice'
import { setLoaderData } from '../../redux/features/loaderSlice'
import LocalLoader from '../global/LocalLoader'
import { FaPlayCircle } from 'react-icons/fa'
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

  // Spring animation for smooth scrolling
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 20,
  })

  useEffect(() => {
    getLanguages().then(res => setLanguages(res))
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      getVoiceForLanguage(selectedLanguage).then(res => {
        setVoices(res)
        setSelectedVoice(res[0])
      })
    }
  }, [selectedLanguage])


  function handlePreviewAudio(e) {
    console.log('previewItem',previewItem,selectedVoice)
    if(selectedVoice && previewItem?.text){
      const data={
        voice:selectedVoice,
        text:previewItem?.text
      }
      textToSpeech(data).then(res=>{
        if(res?.audio_url){
          audioRef.current.src=res?.audio_url
          audioRef.current.play()
        }
      })
    }
  }

  function handlePreviewSubtitle(e, item) {
    e.preventDefault()
    e.stopPropagation()
    setPreviewItem(item)
    document.getElementById('subtitle_audio_preview_modal').showModal()
  }

  useEffect(() => {
    if (currentPlayTime) {
      const idx = subtitles.data.findIndex((subtitle) => {
        return getSecondsFromTime(subtitle.start_time) <= currentPlayTime && getSecondsFromTime(subtitle.end_time) >= currentPlayTime
      })
      setCurrentIdx(idx)
    }
  }, [currentPlayTime])

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
    const startSeconds = getSecondsFromTime(start);
    const endSeconds = getSecondsFromTime(end);
    if (startSeconds <= played && endSeconds >= played) {
      return true;
    }
    return false;
  }

  return (
    <div className='w-full h-full overflow-y-scroll' ref={containerRef}>
      <dialog id="subtitle_audio_preview_modal" className="modal">
        <div className="modal-box">
          {/* <div className="modal-action"> */}
          <form method="dialog">
            <div className='flex w-full gap-2'>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Language</legend>
                <select defaultValue="Pick a browser" className="select" onChange={(e) => setSelectedLaguage(e.target.value)} >
                  <option disabled={true}>Select a Language</option>
                  {languages.map((item, index) => <option key={index} value={item}>{item.split('-')[0]}</option>)}
                </select>
              </fieldset>

              {selectedLanguage && voices.length ? <fieldset className="fieldset">
                <legend className="fieldset-legend">Voices</legend>
                <select defaultValue="Pick a browser" className="select" onChange={e=>setSelectedVoice(e.target.value)}>
                  <option disabled={true}>Select a Voice</option>
                  {voices.map((item, index) => <option key={index} value={item}>{item.split('-')[0]}</option>)}
                </select>
              </fieldset> : ''}

            </div>

            <div className='w-full flex justify-between mt-6 items-center gap-2' >
              <div className='flex items-center gap-2'>
                <div className="btn btn-success" onClick={handlePreviewAudio}>Preview</div>
                <audio ref={audioRef} src={previewItem?.audio} controlsList="nodownload nofullscreen">
                </audio>
              </div>
              <button className="btn">Close</button>
            </div>

          </form>
          {/* </div> */}
        </div>
      </dialog>
      <SubtitleHeader />

      <motion.div
        className='flex flex-col gap-1 p-2 h-full'
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
                className='flex h-24 items-center justify-between gap-1 cursor-pointer bg-slate-800 rounded-md'
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={currentIdx === index && isActiveStyle(item.start_time, item.end_time) ? {
                  color: '#fff',
                  backgroundColor: '#422AD5'
                } : {}}
                onClick={() => {
                  playerRef.current.seekTo(getSecondsFromTime(item.start_time))
                  setCurrentIdx(index)
                }}
              >
                <div className='flex flex-col h-full items-center justify-center px-2 gap-1'>
                  <div>{item?.start_time?.split(',')[0]}</div>
                  <div>{item?.end_time?.split(',')[0]}</div>
                </div>
                <p
                  className='w-full h-auto p-2 py-4 text-[#ccc] subtitle-content'
                  dangerouslySetInnerHTML={{ __html: item.text }}
                  contentEditable
                />
                <FaPlayCircle size={32} className='mx-4' onClick={(e) => handlePreviewSubtitle(e, item)} />
              </motion.div>
            )
          })
        }
      </motion.div>
    </div>
  )
}

export default SubtitleAreaComponent