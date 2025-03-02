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
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  const { url, playing, muted, currentPlayTime } = useAppSelector(
    (state) => state.video
  );
  const { zooms } = useAppSelector((state) => state.elements);

  const [animationProps, setAnimationProps] = useState({
    scale: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.1, ease: "easeInOut" },
  });

  const handleReady = (player) => {
    const videoElement = player.getInternalPlayer();
    if (videoElement) {
      setVideoDimensions({
        width: videoElement.videoWidth || 0,
        height: videoElement.videoHeight || 0,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = playerRef?.current?.getCurrentTime();
      if (currentTime !== undefined && currentTime !== currentPlayTime) {
        dispatch(setCurrentPlayTime(currentTime));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [playerRef, dispatch, currentPlayTime]);

  useEffect(() => {
    const calculateAnimationProps = () => {
      const activeZoom: ZoomElementState = zooms.find(
        (zoom: ZoomElementState) =>
          currentPlayTime >= zoom.start_time && currentPlayTime <= zoom.end_time
      );

      const containerWidth = videoContainerRef.current?.offsetWidth || 0;
      const containerHeight = videoContainerRef.current?.offsetHeight || 0;

      if (activeZoom && containerWidth && containerHeight) {
        const zoomDuration = activeZoom.end_time - activeZoom.start_time;
        const timeInZoom = currentPlayTime - activeZoom.start_time;
        const progress = Math.min(1, Math.max(0, timeInZoom / zoomDuration));
        const easedProgress = Math.sin(progress * Math.PI);
        const zoomRange = activeZoom.zoom_factor - 1;
        const currentZoom = 1 + zoomRange * easedProgress;

        // ROI coordinates (normalized 0-1)
        const roiX = (activeZoom.roi?.x || 50) / 100; // Default to center if undefined
        const roiY = (activeZoom.roi?.y || 50) / 100;

        // Calculate scaled dimensions
        const scaledWidth = containerWidth * currentZoom;
        const scaledHeight = containerHeight * currentZoom;

        // Calculate the position of the ROI in scaled coordinates
        const roiScaledX = roiX * scaledWidth;
        const roiScaledY = roiY * scaledHeight;

        // Calculate offsets to center the ROI
        const xOffset = (containerWidth / 2) - roiScaledX;
        const yOffset = (containerHeight / 2) - roiScaledY;

        // Clamp offsets to prevent the video from moving completely out of view
        const maxXOffset = (scaledWidth - containerWidth) / 2;
        const maxYOffset = (scaledHeight - containerHeight) / 2;
        const clampedX = Math.max(-maxXOffset, Math.min(maxXOffset, xOffset));
        const clampedY = Math.max(-maxYOffset, Math.min(maxYOffset, yOffset));

        return {
          scale: currentZoom,
          x: clampedX,
          y: clampedY,
          transition: {
            duration: 0.1,
            ease: "easeInOut",
          },
        };
      }

      return {
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.1,
          ease: "easeInOut",
        },
      };
    };

    const newProps = calculateAnimationProps();
    setAnimationProps((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newProps) ? newProps : prev
    );

    // Debug logging
    console.log({
      currentPlayTime,
      animationProps: newProps,
    });
  }, [currentPlayTime, zooms, videoDimensions]);

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
          transformOrigin: "center center",
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
          onReady={handleReady}
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