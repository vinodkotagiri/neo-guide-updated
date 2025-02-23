import ReactPlayer from "react-player"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setCurrentPlayTime, setVideoDuration, setVideoPlayed } from "../../redux/features/videoSlice"
import { useEffect } from "react"

function Player({ playerRef }) {
  const { url, playing } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (playerRef?.current?.getCurrentTime()) {
      dispatch(setCurrentPlayTime(playerRef?.current?.getCurrentTime()))
    }
  }, [playerRef?.current?.getCurrentTime()])
  return (<>
    <ReactPlayer
      ref={playerRef}
      // style={{ position: 'absolute', top: 0, left: 0, borderRadius: '0.375rem' }}
      width='100%'
      height='100%'
      controls={false}
      url={url}
      playing={playing}
      onDuration={(duration) => dispatch(setVideoDuration(duration))}
      onProgress={(progress) => dispatch(setVideoPlayed(progress.playedSeconds))}
      onSeek={(time) => dispatch(setVideoPlayed(time))}
    />

  </>

  )
}

export default Player