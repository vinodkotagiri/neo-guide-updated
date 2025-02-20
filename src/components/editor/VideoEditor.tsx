import  { useEffect, useRef } from "react";
import Player from "./Player";
import TimelineArea from "./TimelineArea";
import SubtitlesOverlay from "./SubtitlesOverlay";
import StageOverlay from "./StageOverlay";

const VideoEditor = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Setup for any initialization or cleanup
  }, []);

  return (
    <div className='w-full h-full flex flex-col gap-1'>
      <div className="w-full h-[65%] p-4 flex items-center justify-center flex-col">
        <div className='w-[70%] aspect-16/9 relative overflow-hidden rounded-md'> 
          <Player playerRef={playerRef} />
          <StageOverlay 
            width={window.innerWidth * 0.7} 
            height={window.innerWidth * 0.7 * 9 / 16} 
          />
          <SubtitlesOverlay />
        </div>
      </div>
      <div className="w-full h-[35%] bg-black/30">
        <TimelineArea playerRef={playerRef}/>
      </div>
    </div>
  );
};

export default VideoEditor;