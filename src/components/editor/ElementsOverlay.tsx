// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Arrow, Layer, Rect, Group, Stage, Text, Transformer, Circle } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editArrow, editBlur, editRectangle, editSpotLight, editText, setCurrentElementId } from '../../redux/features/elementsSlice';
import Konva from 'konva';

function ElementsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null); // For the parent div
  const stageRef = useRef<any>(null); // For the Stage component
  const transformerRef = useRef<any>(null);
  const blurRectRef = useRef<any>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { rectangles, blurs, texts, arrows, spotLights } = useAppSelector((state) => state.elements);
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
      if (selectedNode && selectedNode.attrs.visible) {
        transformer.nodes([selectedNode]);
        transformer.getLayer().batchDraw();
      } else {
        transformer.nodes([]);
      }
    }
  }, [selectedId, rectangles, blurs, texts, arrows, spotLights,played]);




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
              draggable
              visible={rect.startTime <= played && rect.endTime >= played}
              filters={[Konva.Filters.Blur]} // Apply blur filter
              blurRadius={100} // Adjust blur intensity dynamically
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
          {texts.map((textElement) => (
            <Text
              key={textElement.id}
              id={textElement.id}
              x={textElement.x}
              y={textElement.y}
              text={textElement.text}
              fontFamily={textElement.font}
              fontSize={textElement.fontSize}
              fill={textElement.fontColor}
              align={textElement.justify}
              backgroundColor={textElement.backgroundColor}
              draggable
              visible={textElement.startTime <= played && textElement.endTime >= played}
              onClick={() => {
                setSelectedId(textElement.id);
                dispatch(setCurrentElementId({ type: 'text', id: textElement.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editText({ id: textElement.id, x, y }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                node.scaleX(1);

                const newFontSize = node.fontSize() * scaleX;
                dispatch(editText({ id: textElement.id, fontSize: newFontSize }));
              }}
            />
          ))}
          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              id={arrow.id}
              points={arrow.points}
              stroke={arrow.stroke}
              strokeWidth={arrow.strokeWidth}
              pointerLength={arrow.pointerLenght}
              pointerWidth={arrow.pointerWidth}
              rotation={arrow.rotation}
              fill={arrow.stroke}
              draggable
              visible={arrow.startTime <= played && arrow.endTime >= played}
              onClick={() => {
                setSelectedId(arrow.id)
                dispatch(setCurrentElementId({ type: 'arrow', id: arrow.id }))
              }}
              onDragMove={(e) => {
                const node = e.target;
                const points = node.points();
                dispatch(
                  editArrow({
                    id: arrow.id,
                    points: [points[0] + e.evt.movementX, points[1] + e.evt.movementY, points[2] + e.evt.movementX, points[3] + e.evt.movementY],
                  })
                );
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                const points = node.points().map((p, i) => (i % 2 === 0 ? p * scaleX : p * scaleY));

                dispatch(
                  editArrow({
                    id: arrow.id,
                    points,
                    rotation
                  })
                );

                node.scaleX(1);
                node.scaleY(1);
              }}
            />
          ))}


          {spotLights.map((spotlight) => (
            <Group>
              {/* Dark Overlay */}
              <Rect
                width={stageSize.width}
                height={stageSize.height}
                fill="black"
                opacity={0.98}
                visible={spotlight.startTime <= played && spotlight.endTime >= played}
              />

              <Rect
                key={spotlight.id}
                id={spotlight.id}
                x={spotlight.x}
                y={spotlight.y}
                width={spotlight.width}
                height={spotlight.height}
                shadowColor={spotlight.glowColor}
                shadowBlur={spotlight.glowRadius}
           
                 fill={spotlight.glowColor}
                cornerRadius={spotlight.cornerRadius}
                draggable
                globalCompositeOperation="destination-out" // CUTOUT EFFECT
                visible={spotlight.startTime <= played && spotlight.endTime >= played}
                onClick={() => {
                  setSelectedId(spotlight.id);
                  dispatch(setCurrentElementId({ type: 'spotlight', id: spotlight.id }));
                }}
                onDragEnd={(e) => {
                  const { x, y } = e.target.position();
                  dispatch(editSpotLight({ id: spotlight.id, x, y }));
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();

                  node.scaleX(1);
                  node.scaleY(1);

                  dispatch(
                    editSpotLight({
                      id: spotlight.id,
                      width: node.width() * scaleX,
                      height: node.height() * scaleY,
                    })
                  );
                }}
              />
            </Group>
          ))}

          <Transformer ref={transformerRef} rotateEnabled={true} />
        </Layer>
      </Stage>
    </div>
  );
}

export default ElementsOverlay;
