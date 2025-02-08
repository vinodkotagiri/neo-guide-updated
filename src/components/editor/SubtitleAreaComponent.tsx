import React, { useEffect, useState } from 'react'
import SubtitleHeader from './SUbtitleHeader'
import { useAppSelector } from '../../redux/hooks'
import { getSecondsFromTime } from '../../helpers'

function SubtitleAreaComponent() {
  const { subtitles, played } = useAppSelector(state => state.video)

  function isActiveStyle(start, end) {
    const startSeconds = getSecondsFromTime(start);
    const endSeconds = getSecondsFromTime(end);
    if (startSeconds <= played && endSeconds >=played) {
      return true;
    }
    return false;
  }

  return (
    <div className='w-full h-full overflow-y-scroll'>
      <SubtitleHeader />
      <div className='flex flex-col gap-1 p-2'>
        {subtitles.data.map((item, index) =>
          <div className='flex h-24 items-center justify-between gap-1  bg-slate-800 rounded-md' key={index} style={isActiveStyle(item.start,item.end)?{color:'#fff'}:{}}>
            <div className='flex flex-col h-full items-center justify-center px-2 gap-1'>
              <div>{item.start}</div>
              <div>{item.end}</div>
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