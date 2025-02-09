  import { useEffect, useState, useRef } from "react";
  import { motion } from "framer-motion";
  import WaveSurfer from "wavesurfer.js";

  function TimeLineEditor({ duration, currentTime, onSeek, videoUrl }) {
    const [timeMarkers, setTimeMarkers] = useState([]);
    const cursorRef = useRef(null);
    const containerRef = useRef(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(1);

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
    }, [currentTime]);

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

    const handleMouseDown = (e) => {
      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();

      const handleMouseMove = (event) => {
        const newTime = Math.max(0, Math.min(duration, Math.round((event.clientX - containerRect.left) / 10)));
        onSeek(newTime);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event) => {
      event.preventDefault(); 
      const newZoom = Math.max(0.5, Math.min(3, zoomLevel + event.deltaY * -0.01));
      setZoomLevel(newZoom);
      if (wavesurferRef.current) {
        wavesurferRef.current.zoom(newZoom * 50);
      }
    };

    return (
      <div ref={containerRef} className="h-64 bg-slate-800 flex overflow-x-scroll relative" onWheel={handleWheel}>
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
          className="absolute w-1 bg-red-500 h-full cursor-ew-resize" 
          style={{ left: `${currentTime * 10}px` }}
          drag="x"
          dragConstraints={{ left: 0, right: duration * 10 }}
          onMouseDown={handleMouseDown}
        />
      </div>
    );
  }

  export default TimeLineEditor;
