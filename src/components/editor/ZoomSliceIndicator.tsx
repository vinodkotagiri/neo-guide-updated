import React, { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { useAppDispatch } from '../../redux/hooks';
import { updateZoomData } from '../../redux/features/zoomSlice';

interface ZoomSliceIndicatorProps {
  start_time: number; // Initial start time of the slice
  end_time: number;   // Initial end time of the slice
  timeLineWidth: number; // Total width of the timeline in pixels
  duration: number;   // Total duration of the timeline in seconds
  index:number;
  zoom_factor:number;
}

const ZoomSliceIndicator = ({
  start_time,
  end_time,
  timeLineWidth,
  duration,
  index,zoom_factor
}: ZoomSliceIndicatorProps) => {
  const [rangeValues, setRangeValues] = useState<number[]>([start_time, end_time]);
  const dispatch=useAppDispatch()
  // Calculate the left offset and width dynamically
  const calculateOffsetAndWidth = (start: number, end: number) => {
    const offset = (start / duration) * timeLineWidth;
    const width = ((end - start) / duration) * timeLineWidth;
    return { offset, width };
  };

  const { offset: leftOffset, width } = calculateOffsetAndWidth(
    rangeValues[0],
    rangeValues[1]
  );

  const handleChange = (values: number[]) => {
    setRangeValues(values);
    const startTime=values[0],endTime=values[1]
    const payload:{start_time?:number,end_time?:number}={}
    if(startTime!=start_time){
      payload['start_time']=startTime
    }
    if(endTime!=end_time){
      payload['end_time']=endTime
    }
    if(Object.keys(payload).length>0){
      dispatch(updateZoomData({index,...payload}))
    }
  };

  if (duration <= 0 || timeLineWidth <= 0) {
    return <div className="text-red-500">Invalid duration or timeline width</div>;
  }

  return (
    <div className="relative w-full h-16">
     
      <Range
        values={rangeValues}
        step={0.1} // Adjust step size for finer control
        min={0}
        max={duration}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="absolute bg-transparent "
            style={{ width: `${timeLineWidth}px`, top: '50%', transform: 'translateY(-50%)' }}
          >
            
            <div
              className="absolute h-10 bg-[#350b99] rounded"
              style={{
                width: `${width}px`,
                left: `${leftOffset}px`,
              }}
            >
              <div className='w-full h-full flex items-center justify-center text-sm text-slate-500 font-light'>zoom : X{zoom_factor}</div>
            </div>
             
            {children}
          </div>
          
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '40px',
              width: '2px',
              backgroundColor: '#fff',
              border: '2px solid #0b99',
              position:'absolute',
              top:'20px',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span
              className="absolute -top-6 text-xs  px-2 py-1 rounded shadow"
              style={{ transform: 'translateX(-50%)' }}
            >
              {rangeValues[index].toFixed(1)}s
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default ZoomSliceIndicator;
