import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import ShapesLayer from './ShapesLayer';

function TimelineArea({ playerRef }) {
  const [markers, setMarkers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseX = useRef(0); // Track last mouse position for deltaX
  const { duration } = useAppSelector(state => state.video);

  useEffect(() => {
    const cleanup = () => {
      if (playerRef?.current?.getCurrentTime) {
        const intervalId = setInterval(() => {
          if (!isDraggingRef.current) {
            const newCursorPosition = playerRef.current.getCurrentTime() * 8;
            setCursorPosition(newCursorPosition);
            autoScroll(newCursorPosition);
          }
        }, 100);
        return () => clearInterval(intervalId);
      }
    };

    if (playerRef?.current) {
      return cleanup();
    }
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
          setLoading(false);
        }
      }
    };
    initMarkers();
  }, [duration]);

  const autoScroll = (position) => {
    if (scrollRef.current) {
      const timelineWidth = timelineRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const buffer = 100;

      if (position > scrollLeft + timelineWidth - buffer) {
        scrollRef.current.scrollLeft = position - timelineWidth + buffer;
      } else if (position < scrollLeft + buffer) {
        scrollRef.current.scrollLeft = position - buffer;
      }
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mouse down:', { x: e.clientX, cursorPosition });
    isDraggingRef.current = true;
    setIsDragging(true);
    lastMouseX.current = e.clientX; // Initialize last mouse position
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMouseX.current;
      console.log('Dragging:', {
        clientX: e.clientX,
        deltaX,
        currentPosition: cursorPosition
      });

      setCursorPosition(prev => {
        const newPosition = prev + deltaX;
        const maxPosition = duration ? (duration - 1) * 8 : 0;
        const boundedPosition = Math.max(0, Math.min(newPosition, maxPosition));

        autoScroll(boundedPosition);

        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(boundedPosition / 8);
        }

        return boundedPosition;
      });

      lastMouseX.current = e.clientX; // Update last mouse position
    }
  };

  const handleMouseUp = (e) => {
    console.log('Mouse up');
    isDraggingRef.current = false;
    setIsDragging(false);
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
  };

  // Framer Motion variants
  const markerVariants = {
    hover: { width: 2, backgroundColor: '#4a5568' },
    rest: { width: 1, backgroundColor: '#cbd5e0' },
  };

  const cursorVariants = {
    hover: { backgroundColor: '#a855f7', scale: 1.05 },
    rest: { backgroundColor: '#d946ef', scale: 1 },
    dragging: { backgroundColor: '#9333ea', scale: 1.1 }
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
      style={{
        scrollBehavior: 'smooth',
        userSelect: 'none',
        position: 'relative',
        minHeight: '100px'
      }}
    >
      <div
        ref={timelineRef}
        className='w-full h-full relative'
        style={{ pointerEvents: 'auto' }}
      >
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
        <div
          className='absolute h-[calc(100%-36px)] top-[36px]'
          style={{ width: markers.length > 0 ? markers[markers.length - 1] * 8 : 0 }}
        >
          <div className='absolute h-[48px] w-full bg-black opacity-10 -top-[36px] -z-10' />
        </div>
        <motion.div
          className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} `}

          style={{
            left: `${cursorPosition}px`,
            width: '4px',
            height: '100%',
            backgroundColor: '#d946ef',
            ...neonGlow,
            zIndex: 20,
            transform: 'translateX(-50%)'
          }}
          variants={cursorVariants}
          initial="rest"
          animate={isDragging ? "dragging" : "rest"}
          whileHover={!isDragging && "hover"}
          onMouseDown={handleMouseDown}
        />
       { playerRef.current&&<ShapesLayer wrapperRef={scrollRef}
        playerRef={playerRef}
         numSegments={Math.ceil(duration/5)}
          thumbnailHeight={36} width={markers[markers.length - 1] * 8} />}
      </div>
    </div>
  );
}

export default TimelineArea;