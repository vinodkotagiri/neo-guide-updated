import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

function ElementsOverlay() {
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

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
          <Rect
            x={50}
            y={50}
            width={100}
            height={100}
            fill="red"
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default ElementsOverlay;
