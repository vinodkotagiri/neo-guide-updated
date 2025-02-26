//@ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { RectangleElementState } from '../../redux/features/elementsSlice';

// Define the rectangle type


const StageOverlay: React.FC<{width:number,height:number}> = ({width, height}) => {
  // State for tracking drawing
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [rectangles, setRectangles] = useState<RectangleElementState[]>([]);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // State for selected rectangle
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Reference for transformer and stage
  const trRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Handle mouse down to start drawing
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setStartPos({ x: pos.x, y: pos.y });
        setSelectedId(null); // Deselect any selected rectangle
      }
    }
  };

  // Handle mouse move while drawing
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    const newRect: Rectangle = {
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
      fill: 'rgba(0,0,255,0.3)',
      stroke: 'black',
      strokeWidth: 1,
      id: `rect${rectangles.length + 1}`,
      rotation: 0,
    };

    setRectangles([...rectangles.slice(0, -1), newRect]);
  };

  // Handle mouse up to finish drawing
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // const lastRect = rectangles[rectangles.length - 1];
      // if (lastRect) {
      //   setSelectedId(lastRect.id);
      // }
    }
  };

  // Handle rectangle selection
  const handleSelect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setSelectedId(e.target.id());
  };

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne<Konva.Rect>(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
    >
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
            rotation={rect.rotation}
            draggable
            onClick={handleSelect}
            onTap={handleSelect}
            onDragEnd={(e) => {
              const node = e.target as Konva.Rect;
              const updatedRects = rectangles.map((r) =>
                r.id === rect.id
                  ? { ...r, x: node.x(), y: node.y() }
                  : r
              );
              setRectangles(updatedRects);
            }}
            onTransformEnd={(e) => {
              const node = e.target as Konva.Rect;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              
              // Reset scale to 1 as we apply it to width/height
              node.scaleX(1);
              node.scaleY(1);

              const updatedRects = rectangles.map((r) =>
                r.id === rect.id
                  ? {
                      ...r,
                      x: node.x(),
                      y: node.y(),
                      width: Math.max(5, node.width() * scaleX),
                      height: Math.max(5, node.height() * scaleY),
                      rotation: node.rotation(),
                    }
                  : r
              );
              setRectangles(updatedRects);
            }}
          />
        ))}
        
        {selectedId && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit minimum size
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default StageOverlay;