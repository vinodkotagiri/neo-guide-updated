import { useEffect, useRef } from "react"
import Player from "./Player"
import TimelineArea from "./TimelineArea";

const VideoEditor = () => {
  const playerRef = useRef(null);
  useEffect(()=>{
    
  },[])
  return (
    <div className='w-full h-full flex flex-col gap-1'>
      <div className="w-full h-[65%]  p-4 flex items-center justify-center flex-col">
        <div className='w-[70%] aspect-16/9 relative overflow-hidden rounded-md'>
          <Player playerRef={playerRef} />
        </div>
      </div>
      <div className="w-full h-[35%] bg-black/30">
      <TimelineArea playerRef={playerRef}/>
      </div>
    </div>
  )
}

export default VideoEditor
