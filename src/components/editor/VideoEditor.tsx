import React, { useRef } from 'react'
import Player from './Player'
import Controls from './Controls'

const VideoEditor = () => {
  const playerRef=useRef(null);
  return (
    <div className='w-full h-full p-2 flex flex-col gap-1'>
      <div className='w-full h-[75%]'>
        <Player playerRef={playerRef}/>
      </div>
      <div className='w-full h-[25%] p-2'>
        <Controls playerRef={playerRef}/>
      </div>
    </div>
  ) 
}

export default VideoEditor