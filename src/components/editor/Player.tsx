// @ts-nocheck
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCurrentSubtitle,
  setVideoDuration,
  setVideoPlayed,
  setVideoPlaying,
} from "../../redux/features/videoSlice";
import { Timeline } from "@xzdarcy/react-timeline-editor";
import TimeLineEditor from "./TimeLineEditor";
import SubtitlesOverlay from "./SubtitlesOverlay";
import { getSecondsFromTime } from "../../helpers";

const Player = ({ playerRef }) => {
  const { url, playing, duration, played,subtitles,currentSubtitle } = useAppSelector(
    (state) => state.video
  );

  // Custom scale component to display time in "mm:ss" format
  const CustomScale = (props: { scale: number }) => {
    const { scale } = props;
    const min = parseInt(scale / 60 + "");
    const second = (scale % 60 + "").padStart(2, "0");
    return <>{`${min}:${second}`}</>;
  };

  const dispatch = useAppDispatch();
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    if (playerRef.current) {
      const width = playerRef.current.wrapper?.clientWidth || 0;
      const height = playerRef.current.wrapper?.clientHeight || 0;
      setVideoWidth(width);
      setVideoHeight(height);
    }
  }, [playerRef]);

  const handleTimelineChange = (newTime) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newTime / duration, "fraction");
      dispatch(setVideoPlayed(newTime));
    }
  };

  useEffect(() => {
   const currentSub=subtitles.data.find(item=>getSecondsFromTime(item.start)<=played&&getSecondsFromTime(item.end)>=played)
   if(JSON.stringify(currentSubtitle)!==JSON.stringify(currentSub))dispatch(setCurrentSubtitle(currentSub))
  },[played,subtitles.data])


  return (
    <div className="w-full h-full relative border-b-[1px] border-slate-700 bg-black">
      <div className="w-full h-[70%] relative">
      <SubtitlesOverlay/>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width={"100%"}
          height={"100%"}
          controls
          playing={playing}
          onDuration={(duration) => dispatch(setVideoDuration(duration))}
          onProgress={(progress) => dispatch(setVideoPlayed(progress.playedSeconds))}
          onSeek={(time) => dispatch(setVideoPlayed(time))}
        />
        
      </div>

      {/* Timeline with Gap and Blue Zoom Track */}
      {/* <div className="w-full h-[29%] relative overflow-visible">
        <Timeline
          style={{ width: "100%", height: "100%", margin: "0 auto" }}
          scale={10}
          rowHeight={50}
          scaleSplitCount={10}
          getScaleRender={(scale) => <CustomScale scale={scale} />}
          editorData={[
            {
              id: "main_track",
              name: "Main Track",
              actions: [
                {
                  id: "main",
                  start: 0,
                  end: duration ?? 0,
                  minStart: 0,
                  maxEnd: duration ?? 0,
                  
                },
              ],
            },
            {
              id: "zoom_track",
              name: "Zoom Track",
              actions: [
                {
                  id: "zoom",
                  start: 0,
                  end: 2,
                  minStart: 0,
                  maxEnd: duration ?? 0,
                },
              ],
              // Add gap and blue background for zoom track
              rowStyle: { marginTop: "20px", backgroundColor: "#1E90FF" },
            },
          ]}
          timeCursor={played}
          effects={[]}
          onTimeCursorChange={(newTime) => handleTimelineChange(newTime)}
        />
      </div> */}
      <div className="w-full h-[29%] relative">
      <TimeLineEditor duration={duration} currentTime={played} onSeek={handleTimelineChange}/>
      </div>
    </div>
  );
};

export default Player;
