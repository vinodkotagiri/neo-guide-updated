import React, { useEffect, useRef, useState } from 'react';
import { Range } from 'react-range';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ZoomSliceIndicator from './ZoomSliceIndicator';

const Controls = ({ playerRef }) => {
  const [values, setValues] = useState([0]); // Slider values
  const [secondsWidth, setSecondsWidth] = useState(0); // Marker width
  const { played, duration } = useAppSelector((state) => state.video); // Video states
  const timelineWrapperRef = useRef<HTMLDivElement | null>(null);
  const {savedZooms}=useAppSelector(state=>state.zoom)
  
  const dispatch = useAppDispatch()
  // Dynamically calculate marker width based on zoom factor and duration
  useEffect(() => {
    if (duration) {
      const timelineWidth = timelineWrapperRef.current?.offsetWidth || 0;
      const width = timelineWidth / (duration)
      setSecondsWidth(width);
    }
  }, [duration]);

  useEffect(() => {
    setValues([played])
  }, [played])

  return (
    <div className="relative w-full h-full" ref={timelineWrapperRef}>
      {/* Timeline markers */}
      <div
        className="timeline-markers flex absolute "
        style={{
          width: '100%',
          height: '64px',
          backgroundColor: '#83018e',
          overflow: 'hidden',
        }}
      >
        {/* Render markers dynamically */}
        {secondsWidth > 0 &&
          Array.from({ length: Math.ceil(duration) }).map((_, index) => (
            <div
              key={index}
              className="marker"
              style={{
                width: `${secondsWidth}px`,
                height: '100%',
                borderLeft: index % 30 === 0 ? '4px solid #000' : '1px solid #000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {index % 30 === 0 && (
                <div className='absolute -bottom-1' style={{ fontSize: '10px', color: '#aaf' }}>{index}</div>
              )}
            </div>
          ))}
      </div>

      {/* Range slider */}
      <Range
        step={1} // Adjust step size based on zoom
        min={0}
        max={duration > 0 ? duration : 1}
        values={values}
        onChange={(values) => {
          setValues(values)
          playerRef.current.seekTo(values[0])
        }} // Update slider values
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '64px',
              width: '100%',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '100%',
              width: '0.25rem',
              backgroundColor: '#abc65f',
            }}
            className="border-none outline-none"
          />
        )}
      />

      <div className='w-full h-10 mt-3'>
        {savedZooms?.map((data,index)=><ZoomSliceIndicator zoom_factor={(data.zoom_factor).toFixed(1)} index={index} start_time={data.start_time} end_time={data.end_time} timeLineWidth={timelineWrapperRef.current?.offsetWidth || 0} duration={duration}  key={index} />)}
      </div>
    </div>
  );
};

export default Controls;
