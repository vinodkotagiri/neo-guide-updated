import  { useEffect, useRef } from "react";
import Player from "./Player";
import TimelineArea from "./TimelineArea";
import SubtitlesOverlay from "./SubtitlesOverlay";
import ElementsOverlay from "./ElementsOverlay";
import { useAppSelector } from "../../redux/hooks";

const VideoEditor = () => {
  const playerRef = useRef(null);
  const {addingElements}=useAppSelector(state=>state.video)
  useEffect(() => {
    // Setup for any initialization or cleanup
  }, []);

  return (
    <div className='w-full h-full flex flex-col gap-1'>
      <div className="w-full h-[65%] p-4 flex items-center justify-center flex-col">
        <div className='w-[70%] aspect-16/9 relative overflow-hidden rounded-md'> 
        {addingElements ? <div className="w-full h-full absolute z-10">
          <ElementsOverlay />
        </div> : ''}
        <SubtitlesOverlay/>
          <SubtitlesOverlay />
          <Player playerRef={playerRef} />
        </div>
      </div>
      <div className="w-full h-[35%] bg-black/30">
        <TimelineArea playerRef={playerRef}/>
      </div>
    </div>
  );
};

export default VideoEditor;