import { useEffect } from "react";
import Player from "./Player"
import TimelineArea from "./TimelineArea";
// import SubtitlesOverlay from "./SubtitlesOverlay";
import ElementsOverlay from "./ElementsOverlay";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { MdFullscreen, MdPauseCircle, MdPlayCircle, MdSkipPrevious } from "react-icons/md";
import { setMuted, setPixelFactor, setVideoPlaying } from "../../redux/features/videoSlice";
import { formatTime } from "../../helpers";
import { BsVolumeMute, BsVolumeUpFill } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

const VideoEditor = ({ playerRef }) => {

  const { playing, duration, muted,pixelFactor } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()


  const enterFullscreen = () => {
    if (playerRef.current) {
      const iframe = playerRef.current.getInternalPlayer();
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };
  const { addingElements } = useAppSelector(state => state.video)
  useEffect(() => {
    // Setup for any initialization or cleanup
  }, []);

  function handleZoomTimeline(operation){
    if(operation=='increase'){
      dispatch(setPixelFactor(pixelFactor+1))
    }
    if(operation=='decrease'){
      dispatch(setPixelFactor(pixelFactor-1))
    }
  }

  return (
    <div className='w-full h-full flex flex-col gap-1 px-2 '>
      <div className="w-full h-[65%]  flex items-center  flex-col bg-[#212025] rounded-2xl  py-8 relative">
        <div className="text-slate-600 absolute right-0 bottom-0 flex  items-center justify-center gap-4 p-2">
          <FaMinus size={18} className="cursor-pointer" onClick={()=>handleZoomTimeline('decrease')}/>
          <FaPlus size={18} className="cursor-pointer" onClick={()=>handleZoomTimeline('increase')}/>
        </div>
        <div className='w-[60%] aspect-16/9 relative overflow-hidden rounded-md'>
          {addingElements ? <div className="w-full h-full absolute z-10">
            <ElementsOverlay />
          </div> : ''}
          {/* <SubtitlesOverlay /> */}
          <Player playerRef={playerRef} />
        </div>
        <div className="text-white flex justify-between w-[60%] mt-8">
          <div className="flex gap-3">
            <div onClick={() => { dispatch(setMuted(!muted)) }} className="cursor-pointer">
              {muted ? <BsVolumeMute size={24} />
                : <BsVolumeUpFill size={24} />}
            </div>
            <div onClick={() => playerRef.current?.seekTo(0)} className="cursor-pointer">
              <MdSkipPrevious size={24} />
            </div>
            <div onClick={() => dispatch(setVideoPlaying(!playing))} className="cursor-pointer">
              {!playing ? <MdPlayCircle size={24} /> : <MdPauseCircle size={24} />}
            </div>
            <div className="text-[#999]">{formatTime(playerRef.current?.getCurrentTime())} / {formatTime(duration)}</div>
          </div>
          <div onClick={enterFullscreen} className="cursor-pointer">
            <MdFullscreen size={24} />
          </div>
        </div>
      </div>

      <div className="w-full h-[35%] bg-black/30">
        <TimelineArea playerRef={playerRef} />
      </div>
    </div>
  );
};

export default VideoEditor;