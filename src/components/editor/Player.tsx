import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCurrentPlayTime,
  setPlayerVideoDimensions,
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

  const [transformOrigin, setTransformOrigin] = useState("center center");

  const handleReady = (player) => {
    const videoElement = player.getInternalPlayer();
    if (videoElement) {
      setVideoDimensions({
        width: videoElement.videoWidth || 0,
        height: videoElement.videoHeight || 0,
      });
      dispatch(setPlayerVideoDimensions({
        width: videoElement.videoWidth || 0,
        height: videoElement.videoHeight || 0,
      }))
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
      const containerWidth = videoContainerRef.current?.offsetWidth || 0;
      const containerHeight = videoContainerRef.current?.offsetHeight || 0;

      const activeZoom: ZoomElementState = zooms?.find(
        (zoom: ZoomElementState) =>
          currentPlayTime >= zoom.start_time && currentPlayTime <= zoom.end_time
      );

      if (activeZoom && containerWidth && containerHeight) {
        const zoomDuration = activeZoom.end_time - activeZoom.start_time;
        const timeInZoom = currentPlayTime - activeZoom.start_time;
        const progress = Math.min(1, Math.max(0, timeInZoom / zoomDuration));
        const easedProgress = Math.sin(progress * Math.PI);
        const zoomRange = activeZoom.zoom_factor - 1;
        const currentZoom = 1 + zoomRange * easedProgress;

        // Normalize ROI coordinates and size (assume input might be in pixels or percentage)
        let roiX = activeZoom.roi?.x || 50;
        let roiY = activeZoom.roi?.y || 50;
        let roiWidth = activeZoom.roi?.width || 20; // Default to pixels
        let roiHeight = activeZoom.roi?.height || 20;

        // Normalize ROI coordinates and size
        roiX = roiX > 1 ? roiX / containerWidth : roiX / 100;
        roiY = roiY > 1 ? roiY / containerHeight : roiY / 100;
        roiWidth = roiWidth > 1 ? roiWidth : roiWidth * containerWidth;
        roiHeight = roiHeight > 1 ? roiHeight : roiHeight * containerHeight;

        // Clamp ROI coordinates to valid range (0-1)
        roiX = Math.max(0, Math.min(1, roiX));
        roiY = Math.max(0, Math.min(1, roiY));

        // Calculate ROI boundaries in pixels (unscaled)
        const roiPixelWidth = Math.min(roiWidth, containerWidth);
        const roiPixelHeight = Math.min(roiHeight, containerHeight);
        const roiLeft = roiX * containerWidth - roiPixelWidth / 2;
        const roiTop = roiY * containerHeight - roiPixelHeight / 2;
        const roiRight = roiLeft + roiPixelWidth;
        const roiBottom = roiTop + roiPixelHeight;

        // Set transform origin to ROI center in percentage
        const roiXPercent = roiX * 100;
        const roiYPercent = roiY * 100;
        setTransformOrigin(`${roiXPercent}% ${roiYPercent}%`);

        // Calculate scaled dimensions
        const scaledWidth = containerWidth * currentZoom;
        const scaledHeight = containerHeight * currentZoom;

        // Calculate scaled ROI boundaries
        const scaledRoiLeft = roiLeft * currentZoom;
        const scaledRoiTop = roiTop * currentZoom;
        const scaledRoiRight = roiRight * currentZoom;
        const scaledRoiBottom = roiBottom * currentZoom;

        // Offsets to keep ROI fully in frame
        let xOffset = 0;
        let yOffset = 0;

        // Adjust xOffset to keep ROI left and right edges in view
        if (scaledRoiLeft < 0) {
          xOffset = -scaledRoiLeft; // Move right if left edge is out
        } else if (scaledRoiRight > scaledWidth) {
          xOffset = -(scaledRoiRight - scaledWidth); // Move left if right edge is out
        }

        // Adjust yOffset to keep ROI top and bottom edges in view
        if (scaledRoiTop < 0) {
          yOffset = -scaledRoiTop; // Move down if top edge is out
        } else if (scaledRoiBottom > scaledHeight) {
          yOffset = -(scaledRoiBottom - scaledHeight); // Move up if bottom edge is out
        }

        // Clamp offsets to prevent over-shifting
        const maxXOffset = (scaledWidth - containerWidth) / 2;
        const maxYOffset = (scaledHeight - containerHeight) / 2;
        const clampedX = Math.max(-maxXOffset, Math.min(maxXOffset, xOffset));
        const clampedY = Math.max(-maxYOffset, Math.min(maxYOffset, yOffset));

   

        return {
          scale: currentZoom,
          x: clampedX,
          y: clampedY,
          transition: { duration: 0.1, ease: "easeInOut" },
        };
      }

      setTransformOrigin("center center");
      return {
        scale: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.1, ease: "easeInOut" },
      };
    };

    const newProps = calculateAnimationProps();
    setAnimationProps((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newProps) ? newProps : prev
    );
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
          transformOrigin: transformOrigin,
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
          // config={{
          //   file: {
          //     attributes: {
          //       style: {
          //         width: "100%",
          //         height: "100%",
          //         objectFit: "cover",
          //       },
          //     },
          //   },
          // }}
        />
      </motion.div>
    </div>
  );
}

export default Player;