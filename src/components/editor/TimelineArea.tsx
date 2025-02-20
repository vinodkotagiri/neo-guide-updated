import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { motion, AnimatePresence } from 'framer-motion';

function TimelineArea({ playerRef }) {
  const [markers, setMarkers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const scrollRef = useRef(null);
  const { duration } = useAppSelector(state => state.video);

  useEffect(() => {
    // Sync cursor position with video play time
    const cleanup = () => {
      if (playerRef?.current?.getCurrentTime) {
        const intervalId = setInterval(() => {
          const newCursorPosition = playerRef.current.getCurrentTime() * 8;
          setCursorPosition(newCursorPosition);

          // Scroll if cursor goes out of view
          if (scrollRef.current) {
            const timelineWidth = timelineRef.current.offsetWidth;
            const scrollLeft = scrollRef.current.scrollLeft;

            if (newCursorPosition > scrollLeft + timelineWidth - 100 || newCursorPosition < scrollLeft + 100) {
              scrollRef.current.scrollLeft = newCursorPosition - timelineWidth / 2;
            }
          }
        }, 100);
        return () => clearInterval(intervalId);
      }
    };

    if (playerRef?.current) {
      cleanup();
    }

    return cleanup;
  }, [playerRef]);

  useEffect(() => {
    const initMarkers = async () => {
      if (duration) {
        try {
          const mrkrs = Array.from({ length: duration }, (_, i) => i);
          setMarkers(mrkrs);
          setLoading(false);
        } catch (error) {
          console.error('Error setting up markers:', error);
          setLoading(false); // Ensure loading state is set to false even on error
        }
      }
    };

    initMarkers();
  }, [duration]);

  // Handle cursor drag
  const handleCursorDrag = (event) => {
    if (timelineRef.current && scrollRef.current) {
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const scrollLeft = scrollRef.current.scrollLeft;
      const timelineWidth = timelineRef.current.scrollWidth; // Full width, including overflow

      // Calculate new cursor position
      let mouseX = event.clientX - timelineRect.left + scrollLeft;

      // Ensure cursor stays within bounds
      mouseX = Math.max(0, Math.min(mouseX, timelineWidth));

      // Convert pixel position to time
      const newTime = mouseX / 8;
      playerRef.current.seekTo(newTime);

      setCursorPosition(mouseX);

      // Smooth auto-scroll
      const buffer = 100;
      if (mouseX > scrollLeft + timelineRect.width - buffer) {
        scrollRef.current.scrollLeft = Math.min(scrollRef.current.scrollLeft + buffer, timelineWidth - timelineRect.width);
      } else if (mouseX < scrollLeft + buffer) {
        scrollRef.current.scrollLeft = Math.max(scrollRef.current.scrollLeft - buffer, 0);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleCursorDrag);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleCursorDrag);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Framer Motion variants for animations
  const markerVariants = {
    hover: { width: 2, backgroundColor: '#4a5568' },
    rest: { width: 1, backgroundColor: '#cbd5e0' },
  };

  const cursorVariants = {
    hover: { backgroundColor: '#a855f7', scale: 1.05 },
    rest: { backgroundColor: '#d946ef', scale: 1 },
  };

  const numberVariants = {
    hover: { color: '#4a5568', fontWeight: 'bold' },
    rest: { color: '#cbd5e0' },
  };

  const loadingVariants = {
    start: { opacity: 0, scale: 0.5 },
    end: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  // Neon glow effect styles
  const neonGlow = {
    boxShadow: '0 0 10px #4a5568, 0 0 20px #4a5568, 0 0 30px #4a5568, 0 0 40px #4a5568',
    transition: 'box-shadow 0.3s ease-in-out'
  };

  const neonGlowHover = {
    boxShadow: '0 0 20px #6b7280, 0 0 30px #6b7280, 0 0 40px #6b7280, 0 0 50px #6b7280'
  };

  if (loading) {
    return (
      <motion.div
        className='w-full h-full flex justify-center items-center bg-gray-900'
        variants={loadingVariants}
        initial="start"
        animate="end"
      >
        <div className="text-white text-2xl">Loading timeline...</div>
      </motion.div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className='w-full h-full overflow-x-scroll bg-gray-900'
    >
      <div ref={timelineRef} className='w-full h-full relative'>
        {markers.map((item, index) => (
          <motion.div
            key={index}
            className='absolute top-0 cursor-pointer z-10 bg-slate-400'
            style={{
              left: `${item * 8}px`,
              height: item % 10 === 0 ? '8px' : '4px',
              ...neonGlow
            }}
            variants={{
              ...markerVariants,
              hover: { ...markerVariants.hover, ...neonGlowHover }
            }}
            initial="rest"
            whileHover="hover"
            onClick={() => playerRef.current?.seekTo(item)}
          />
        ))}
        <AnimatePresence>
          {markers.map((item, index) => (
            item % 10 === 0 && (
              <motion.div
                key={index}
                className='absolute top-3 left-4 cursor-pointer z-10 text-xs'
                style={{
                  left: `${item * 8}px`,
                  color: '#cbd5e0'
                }}
                variants={{
                  ...numberVariants,
                  hover: { ...numberVariants.hover, ...neonGlowHover }
                }}
                initial="rest"
                whileHover="hover"
                onClick={() => playerRef.current?.seekTo(item)}
              >
                {item}
              </motion.div>
            )
          ))}
        </AnimatePresence>
        <div className='absolute h-[calc(100%-36px)] top-[36px]' style={{ width: markers[markers.length - 1] * 8 }}>
          <div className='absolute h-[48px] w-full bg-black opacity-10 -top-[36px] -z-10' />
        </div>
        <motion.div
          className='absolute cursor-grab'
          style={{
            left: `${cursorPosition}px`,
            width: '2px', // I-beam width
            height: '100%', // Full height of the timeline
            backgroundColor: '#d946ef',
            ...neonGlow
          }}
          variants={{
            ...cursorVariants,
            hover: {
              ...cursorVariants.hover,
              ...neonGlowHover,
            }
          }}
          initial="rest"
          whileHover="hover"
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}

export default TimelineArea;