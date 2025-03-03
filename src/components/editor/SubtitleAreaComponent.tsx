//@ts-nocheck
import React, { useEffect, useState } from 'react'
import SubtitleHeader from './SubtitleHeader'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getSecondsFromTime } from '../../helpers'
import { getProgress, getSubtitles } from '../../api/axios'
import toast from 'react-hot-toast'
import { setLocked, updateRetries, updateSubtitleData } from '../../redux/features/videoSlice'
import { setLoader, setLoaderData } from '../../redux/features/loaderSlice'
import TimeLineLoader from './TimeLineLoader'
import LocalLoader from '../global/LocalLoader'

function SubtitleAreaComponent() {
  const { subtitles, played, url,retries } = useAppSelector(state => state.video)
   const { percentage, status } = useAppSelector(state => state.loader)
  const [reqId, setReqId] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!subtitles.data.length && retries<3) {
      getSubtitles({ target_language: 'en', video_path: url }).then((res) => {
        const request_id = res?.request_id;
        if (request_id) {
          setReqId(request_id);
          // toast.success('Video uploaded successfully');
        } else {
          // toast.error('Forbidden');
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
            if(data?.error){
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
    <div className='w-full h-full overflow-y-scroll'>
      <SubtitleHeader />
      
      <div className='flex flex-col gap-1 p-2 h-full'>
      {!subtitles.data.length ? <div className='w-full h-full overflow-auto relative '>
        <LocalLoader progress={percentage} text={status} />
      </div>:
        subtitles.data.map((item, index) =>
          <div className='flex h-24 items-center justify-between gap-1  bg-slate-800 rounded-md' key={index} style={isActiveStyle(item.start_time, item.end_time) ? { color: '#fff' } : {}}>
            <div className='flex flex-col h-full items-center justify-center px-2 gap-1'>
              <div>{item.start_time}</div>
              <div>{item.end_time}</div>
            </div>
            <div className='flex-1 px-2'>
              {item.text}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubtitleAreaComponent