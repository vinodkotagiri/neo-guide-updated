import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {v4} from 'uuid'
import { setCurrentElementId } from '../../redux/features/elementsSlice';
function ElementsOverlay() {
  const stageRef = useRef(null);
  const dispatch = useAppDispatch()
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const {rectangles}=useAppSelector(state=>state.elements)
  useEffect(() => {
    const updateStageSize = () => {
      if (stageRef.current) {
        const { offsetWidth, offsetHeight } = stageRef.current.parentElement;
        setStageSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    // Set initial size
    updateStageSize();

    // Update size on window resize
    window.addEventListener('resize', updateStageSize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  return (
    <div ref={stageRef} style={{ width: '100%', height: '100%' }}>
      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          {rectangles.map((rect) => <Rect
            id={rect.id}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.fillColor}
            stroke={rect.strokeColor}
            strokeWidth={rect.strokeWidth}
            cornerRadius={rect.cornerRadius}
            draggable
            onClick={() => dispatch(setCurrentElementId({type:'rectangle',id:rect.id}))}
          />)}
        </Layer>
      </Stage>
    </div>
  );
}

export default ElementsOverlay;
