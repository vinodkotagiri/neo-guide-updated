import { stat } from 'fs'
import React from 'react'
import { useAppSelector } from '../../redux/hooks'

function SubtitlesOverlay() {
  const {currentSubtitle,subtitles}=useAppSelector(state=>state.video)
  return (
    <div className='w-full bottom-20 left-0 absolute 0 z-[9999] p-4'>
      <div style={{backgroundColor:subtitles.background,color:subtitles.color,fontSize:subtitles.fontSize,fontFamily:subtitles.font,textAlign:subtitles.textJustify}}>
        {currentSubtitle?.text}
      </div>
    </div>
  )
}

export default SubtitlesOverlay