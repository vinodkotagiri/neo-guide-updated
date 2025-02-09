import { useEffect, useState, useRef } from "react";

function TimeLineEditor({ duration, currentTime, onSeek }) {
  const [timeMarkers, setTimeMarkers] = useState([]);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

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

  return (
    <div ref={containerRef} className="h-64 bg-slate-800 flex overflow-x-scroll relative">
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
      <div 
        ref={cursorRef} 
        className="absolute w-1 bg-red-500 h-full cursor-ew-resize" 
        style={{ left: `${currentTime * 10}px` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default TimeLineEditor;
