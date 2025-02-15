import React, { useRef, useState, useEffect } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editBlur, editRectangle, setCurrentElementId } from '../../redux/features/elementsSlice';
import Konva from 'konva';

function ElementsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null); // For the parent div
  const stageRef = useRef<any>(null); // For the Stage component
  const transformerRef = useRef<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { rectangles, blurs } = useAppSelector((state) => state.elements);
  const { played } = useAppSelector(state => state.video)
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const transformer = transformerRef.current;
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformer.getLayer().batchDraw();
      } else {
        transformer.nodes([]);
      }
    }
  }, [selectedId, rectangles]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage ref={stageRef} width={stageSize.width} height={stageSize.height}>
        <Layer>
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
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
              visible={rect.startTime <= played && rect.endTime >= played}
              onClick={() => {
                setSelectedId(rect.id);
                dispatch(setCurrentElementId({ type: 'rectangle', id: rect.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editRectangle({ id: rect.id, x, y }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Reset scale so it doesn't accumulate
                node.scaleX(1);
                node.scaleY(1);

                const newWidth = node.width() * scaleX;
                const newHeight = node.height() * scaleY;

                // Update rectangle size in Redux store
                dispatch(editRectangle({ id: rect.id, width: newWidth, height: newHeight }));
              }}
            />
          ))}
          {blurs.map((rect) => (
            <Rect
              key={rect.id}
              id={rect.id}
              x={rect.x}
              y={rect.y}
              fill={'rgba(0,0,0,99)'}
              width={rect.width}
              height={rect.height}
              stroke={'rgba(0,0,0,8)'}
              strokeWidth={2}
              draggable
              visible={rect.startTime <= played && rect.endTime >= played}
              filters={[Konva.Filters.Blur]} // Apply blur filter
              blurRadius={ 100} // Adjust blur intensity dynamically
              ref={(node) => {
                if (node) {
                  node.cache(); // Required for filters
                  node.getLayer()?.batchDraw();
                }
              }}
              onClick={() => {
                setSelectedId(rect.id);
                dispatch(setCurrentElementId({ type: 'blur', id: rect.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editBlur({ id: rect.id, x, y }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Reset scale so it doesn't accumulate
                node.scaleX(1);
                node.scaleY(1);

                const newWidth = node.width() * scaleX;
                const newHeight = node.height() * scaleY;

                // Update rectangle size in Redux store
                dispatch(editBlur({ id: rect.id, width: newWidth, height: newHeight }));
              }}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}

export default ElementsOverlay;
