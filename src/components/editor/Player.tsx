import ReactPlayer from "react-player"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setVideoDuration, setVideoPlayed } from "../../redux/features/videoSlice"

function Player({ playerRef }) {
  const { url, playing } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  return (<>
    <ReactPlayer
      ref={playerRef}
      style={{ position: 'absolute', top: 0, left: 0, borderRadius: '0.375rem' }}
      width='100%'
      height='100%'
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