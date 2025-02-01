// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setVideoDuration, setVideoPlayed, setVideoPlaying } from '../../redux/features/videoSlice'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import ROISelector from './ROISelector'
import { setZoomROI } from '../../redux/features/zoomSlice'
import thumbnail from '../../assets/images/thumbnail.jpg'
const Player = ({ playerRef }) => {
  const { url, playing } = useAppSelector(state => state.video)
  const {zooming}=useAppSelector(state=>state.zoom)
  const [roiData, setRoiData] = useState(null)
  const dispatch = useAppDispatch()
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 })
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);


  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer() // Accessing the player
      const videoWidth = player?.videoWidth || 0
      const videoHeight = player?.videoHeight || 0
      setVideoDimensions({ width: videoWidth, height: videoHeight })
    }
  }, [playerRef])

  function handlePlayPause() {
    dispatch(setVideoPlaying(!playing))
  }

  const handleROIChange = (newData) => {
    setRoiData(newData)
    dispatch(setZoomROI(newData))
  }

  const handleOnReady = () => {
    if (playerRef.current) {
      const width = playerRef.current.wrapper?.clientWidth || 0;
      const height = playerRef.current.wrapper?.clientHeight || 0;
      setVideoWidth(width);
      setVideoHeight(height);
    }
  };
  return (
    <div className='w-full h-full relative border-b-[1px] border-slate-700 bg-black'>
      {zooming&&<ROISelector
        onROIChange={handleROIChange}
        videoWidth={videoWidth}
        videoHeight={videoHeight}
        roiData={roiData}
      />}
      <ReactPlayer
       onReady={handleOnReady}
        ref={playerRef}
        url={url}
        width={'100%'}
        height={'100%'}
        controls
        playing={playing}
        onDuration={(duration) => dispatch(setVideoDuration(duration))}
        onProgress={(played) => dispatch(setVideoPlayed(played.playedSeconds))}
        onSeek={(e) => console.log(e)}
      />
     
      <div className='z-[99999] absolute -bottom-4 left-1/2 -translate-x-1/2'>
        <button className='btn btn-circle' onClick={handlePlayPause}>
          {!playing ? <FaPlayCircle size={48} /> : <FaPauseCircle size={48} />}
        </button>
      </div>
    </div>
  )
}

export default Player
