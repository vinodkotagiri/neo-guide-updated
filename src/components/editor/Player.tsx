import ReactPlayer from "react-player"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setCurrentPlayTime, setVideoDuration, setVideoPlayed } from "../../redux/features/videoSlice"
import { useEffect } from "react"

function Player({ playerRef }) {
  const { url, playing,muted } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (playerRef?.current?.getCurrentTime()) {
      dispatch(setCurrentPlayTime(playerRef?.current?.getCurrentTime()))
    }
  }, [playerRef?.current?.getCurrentTime()])
  return (<>
    <ReactPlayer
      ref={playerRef}
      width='100%'
      height='100%'
      controls={false}
      url={url}
      muted={muted}
      playing={playing}
      onDuration={(duration) => dispatch(setVideoDuration(duration))}
      onProgress={(progress) => dispatch(setVideoPlayed(progress.playedSeconds))}
      onSeek={(time) => dispatch(setVideoPlayed(time))}
    />

  </>

  )
}

export default Player