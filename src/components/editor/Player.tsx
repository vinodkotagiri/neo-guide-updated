import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCurrentPlayTime,
  setVideoDuration,
  setVideoPlayed,
} from "../../redux/features/videoSlice";
import { motion } from "framer-motion";
import { ZoomElementState } from "../../redux/features/elementsSlice";

function Player({ playerRef }) {
  const dispatch = useAppDispatch();
  const videoContainerRef = useRef(null);

  // Get video state and zooms from Redux
  const { url, playing, muted, currentPlayTime } = useAppSelector(
    (state) => state.video
  );
  const { zooms } = useAppSelector((state) => state.elements);

  // State to hold animation properties
  const [animationProps, setAnimationProps] = useState({
    scale: 1,
    originX: 0.5,
    originY: 0.5,
    transition: { duration: 0.1, ease: "easeInOut" },
  });

  // Update current play time more reliably
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = playerRef?.current?.getCurrentTime();
      if (currentTime !== undefined && currentTime !== currentPlayTime) {
        dispatch(setCurrentPlayTime(currentTime));
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [playerRef, dispatch, currentPlayTime]);

  // Update animation properties
  useEffect(() => {
    const calculateAnimationProps = () => {
      const activeZoom: ZoomElementState = zooms.find(
        (zoom: ZoomElementState) =>
          currentPlayTime >= zoom.start_time && currentPlayTime <= zoom.end_time
      );

      if (activeZoom) {
        const zoomDuration = activeZoom.end_time - activeZoom.start_time;
        const timeInZoom = currentPlayTime - activeZoom.start_time;
        const progress = Math.min(1, Math.max(0, timeInZoom / zoomDuration));
        
        const easedProgress = Math.sin(progress * Math.PI);
        const zoomRange = activeZoom.zoom_factor - 1;
        const currentZoom = 1 + zoomRange * easedProgress;

        return {
          scale: currentZoom,
          originX: activeZoom.roi?.x ? activeZoom.roi.x / 100 : 0.5,
          originY: activeZoom.roi?.y ? activeZoom.roi.y / 100 : 0.5,
          transition: {
            duration: 0.1,
            ease: "easeInOut",
          },
        };
      }

      return {
        scale: 1,
        originX: 0.5,
        originY: 0.5,
        transition: {
          duration: 0.1,
          ease: "easeInOut",
        },
      };
    };

    const newProps = calculateAnimationProps();
    // Only update if props actually changed to prevent unnecessary renders
    setAnimationProps((prev) => 
      JSON.stringify(prev) !== JSON.stringify(newProps) ? newProps : prev
    );

    // Debug logging
    console.log({
      currentPlayTime,
      activeZoom: zooms.find(
        (zoom: ZoomElementState) =>
          currentPlayTime >= zoom.start_time && currentPlayTime <= zoom.end_time
      ),
      animationProps: newProps,
    });
  }, [currentPlayTime, zooms]);

  return (
    <div
      ref={videoContainerRef}
      className="absolute w-full top-0"
      style={{
        overflow: "hidden",
        height: "100%",
        position: "relative",
      }}
    >
      <motion.div
        animate={animationProps}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          controls={false}
          url={url}
          muted={muted}
          playing={playing}
          onDuration={(duration) => dispatch(setVideoDuration(duration))}
          onProgress={(progress) => {
            dispatch(setVideoPlayed(progress.playedSeconds));
          }}
          onSeek={(time) => dispatch(setVideoPlayed(time))}
          config={{
            file: {
              attributes: {
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
              },
            },
          }}
        />
      </motion.div>
    </div>
  );
}

export default Player;