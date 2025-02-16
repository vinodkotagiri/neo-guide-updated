import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
import ShapesLayer from "./ShapesLayer";
import { Range } from "react-range";

function TimeLineEditor({ duration, currentTime, onSeek, videoUrl }) {
  const [timeMarkers, setTimeMarkers] = useState([]);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [draggingTime, setDraggingTime] = useState(currentTime); // Track the dragging position

  useEffect(() => {
    const markers = [];
    for (let i = 0; i <= duration; i++) {
      markers.push(i);
    }
    setTimeMarkers(markers);
  }, [duration]);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${currentTime * 10}px`;
    }

    // Auto-scroll the timeline only if not dragging
    if (containerRef.current && currentTime !== draggingTime) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cursorPos = currentTime * 10;
      const scrollPosition = cursorPos - containerRect.width / 2;
      containerRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  }, [currentTime, draggingTime, duration]);

  useEffect(() => {
    if (waveformRef.current && videoUrl) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4F46E5",
        progressColor: "#EF4444",
        cursorColor: "#F59E0B",
        barWidth: 2,
        height: 64,
        backend: "MediaElement",
        mediaType: "video",
        responsive: true,
      });
      wavesurferRef.current.load(videoUrl);
      return () => wavesurferRef.current.destroy();
    }
  }, [videoUrl]);

  const handleWheel = (event) => {
    event.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + event.deltaY * -0.01));
    setZoomLevel(newZoom);
    if (wavesurferRef.current) {
      wavesurferRef.current.zoom(newZoom * 50);
    }
  };

  return (
    <div ref={containerRef} className="h-64 bg-slate-900 flex overflow-x-scroll relative opacity-40 w-[calc(100%-40px)]" onWheel={handleWheel}>
      <div ref={waveformRef} className="absolute top-0 left-0 w-full h-full opacity-50" />
      {timeMarkers.map((time) => (
        <div key={time}>
          <div
            className="absolute w-px bg-slate-500"
            style={{
              left: `${time * 10}px`,
              height: time % 30 === 0 ? '25%' : '12.5%'
            }}
          />
          <div
            className="absolute text-xs font-semibold text-white"
            style={{ left: `${time * 10 + 4}px`, top: '13%' }}
          >
            {time % 30 === 0 ? time : ''}
          </div>
        </div>
      ))}

      {/* Draggable Cursor */}
      <motion.div
        ref={cursorRef}
        className="absolute w-[2px] bg-purple-500 h-full cursor-pointer hover:w-1 shadow-[0_0_10px_#6a0dad,0_0_40px_#8a2be2,0_0_80px_#d580ff] flex flex-col items-center"
        style={{ left: `${draggingTime * 10}px` }}
        drag="x"
        onDrag={(event, info) => {
          const newTime = info.offset.x / 10;
          setDraggingTime(currentTime + newTime);
        }}
        onDragEnd={() => {
          if (draggingTime !== currentTime) {
            onSeek(draggingTime);
          }
        }}
      >
        {/* Downward Triangle */}
        <motion.div
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-purple-500 mb-1"
          animate={{ boxShadow: ["0 0 10px #6a0dad", "0 0 20px #8a2be2", "0 0 40px #d580ff"] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>
      {/* ELEMENTS LAYER */}

      
      <ShapesLayer onSeek={onSeek} />
    </div>
  );
}

export default TimeLineEditor;
