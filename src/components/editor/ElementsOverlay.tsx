// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Arrow, Layer, Rect, Group, Stage, Text, Transformer, Circle } from 'react-konva';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { editArrow, editBlur, editRectangle, editSpotLight, editText, editZoom, setCurrentElementId } from '../../redux/features/elementsSlice';
import Konva from 'konva';
Konva.Filters.RadialBlur = function (imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const radius = this.blurRadius() || 10;
  const centerX = width / 2;
  const centerY = height / 2;


  // Create a temporary buffer
  const tempData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Calculate distance from center
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate blur amount based on distance
      const blurAmount = Math.min(1, distance / radius);

      // Sample neighboring pixels
      let r = 0, g = 0, b = 0, a = 0;
      let samples = 0;

      for (let offset = -2; offset <= 2; offset++) {
        const sampleX = Math.round(x + (dx * blurAmount * offset * 0.1));
        const sampleY = Math.round(y + (dy * blurAmount * offset * 0.1));

        if (sampleX >= 0 && sampleX < width && sampleY >= 0 && sampleY < height) {
          const sampleIdx = (sampleY * width + sampleX) * 4;
          r += tempData[sampleIdx];
          g += tempData[sampleIdx + 1];
          b += tempData[sampleIdx + 2];
          a += tempData[sampleIdx + 3];
          samples++;
        }
      }

      // Average the samples
      data[idx] = r / samples;
      data[idx + 1] = g / samples;
      data[idx + 2] = b / samples;
      data[idx + 3] = a / samples;
    }
  }
};
function ElementsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null); // For the parent div
  const stageRef = useRef<any>(null); // For the Stage component
  const transformerRef = useRef<any>(null);
  const blurRectRef = useRef<any>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { rectangles, blurs, texts, arrows, spotLights, currentElementId, zooms } = useAppSelector((state) => state.elements);
  const { played, currentPlayTime, videoWidth, videoHeight } = useAppSelector(state => state.video)

  const [scalingX, setScalingX] = useState(1)
  const [scalingY, setScalingY] = useState(1)

  const checkDeselect = (e) => {
    if (e.target === stageRef.current) {
      dispatch(setCurrentElementId({ id: null, type: null }));
      setSelectedId(null);
    }
  };

  useEffect(() => { setSelectedId(currentElementId) }, [currentElementId])

  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({ width: offsetWidth, height: offsetHeight });

        setScalingX(offsetWidth / videoWidth)
        setScalingY(offsetHeight / videoHeight)
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
        transformer.getLayer().batchDraw();
      }
    }
  }, [selectedId, rectangles, blurs, texts, arrows, spotLights, played, zooms]);



  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {blurs.map((rect) => (
        <BlurOverlay key={rect.id} rect={rect} played={played} />
      ))}

      <Stage ref={stageRef} width={stageSize.width} height={stageSize.height} onMouseDown={checkDeselect} >
        <Layer>
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              id={rect.id}
              x={rect.x * scalingX}
              y={rect.y * scalingY}
              width={rect.width * scalingX}
              height={rect.height * scalingY}
              fill={rect.fillColor}
              stroke={rect.strokeColor}
              strokeWidth={rect.strokeWidth}
              cornerRadius={rect.cornerRadius}

              draggable
              visible={rect.startTime <= currentPlayTime && rect.endTime >= currentPlayTime}
              onClick={() => {
                setSelectedId(rect.id);
                dispatch(setCurrentElementId({ type: 'rectangle', id: rect.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editRectangle({ id: rect.id, x: x / scalingX, y: y / scalingY }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Reset scale so it doesn't accumulate
                node.scaleX(1);
                node.scaleY(1);

                const newWidth = node.width() * scaleX / scalingX;
                const newHeight = node.height() * scaleY / scalingY;

                // Update rectangle size in Redux store
                dispatch(editRectangle({ id: rect.id, width: newWidth, height: newHeight }));
              }}
            />
          ))}
          {blurs.map((rect) => (
            <Rect
              ref={blurRectRef}
              key={rect.id}
              id={rect.id}
              x={rect.x }
              y={rect.y }
              fill={'transparent'}
              // stroke={"#000000"}
              width={rect.width }
              height={rect.height }
              draggable
              visible={rect.startTime <= played && rect.endTime >= played}
              onClick={() => {
                setSelectedId(rect.id);
                dispatch(setCurrentElementId({ type: 'blur', id: rect.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editBlur({ id: rect.id, x: x / scalingX, y: y / scalingY }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Reset scale so it doesn't accumulate
                node.scaleX(1);
                node.scaleY(1);

                const newWidth = node.width() * scaleX / scalingX;
                const newHeight = node.height() * scaleY / scalingY;

                // Update rectangle size in Redux store
                dispatch(editBlur({ id: rect.id, width: newWidth, height: newHeight }));

              }}
            />
          ))}
          {texts.map((textElement) => (
            <Text
              key={textElement.id}
              id={textElement.id}
              x={textElement.x * scalingX}
              y={textElement.y * scalingY}
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
                dispatch(editText({ id: textElement.id, x: x / scalingX, y: y / scalingY }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                node.scaleX(1);

                const newFontSize = node.fontSize() * scaleX / scalingX;
                dispatch(editText({ id: textElement.id, fontSize: newFontSize }));
              }}
            />
          ))}
          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              id={arrow.id}
              x={arrow.x * scalingX}
              y={arrow.y * scalingY}
              hitStrokeWidth={50}
              points={arrow.points} // Points should be relative to (0, 0)
              stroke={arrow.stroke}
              strokeWidth={arrow.strokeWidth * scalingX}
              pointerLength={arrow.pointerLength * scalingX}
              pointerWidth={arrow.pointerWidth * scalingX}
              rotation={arrow.rotation}
              fill={arrow.stroke}
              draggable
              visible={arrow.startTime <= played && arrow.endTime >= played}
              onClick={() => {
                setSelectedId(arrow.id);
                dispatch(setCurrentElementId({ type: 'arrow', id: arrow.id }));
              }}
              onRotationEnd={(e) => {
                const node = e.target;
                const rotation = node.rotation();
                dispatch(editArrow({ id: arrow.id, rotation }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(
                  editArrow({
                    id: arrow.id,
                    x: x / scalingX,
                    y: y / scalingY,
                  })
                );
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const rotation = node.rotation();
                const scaledPoints = node.points().map((p, i) =>
                  i % 2 === 0 ? p * scaleX : p * scaleY
                );

                // Reset scaling
                node.scaleX(1);
                node.scaleY(1);

                dispatch(
                  editArrow({
                    id: arrow.id,
                    points: scaledPoints,
                    rotation,
                  })
                );
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
                x={spotlight.x * scalingX}
                y={spotlight.y * scalingY}
                width={spotlight.width * scalingX}
                height={spotlight.height * scalingY}
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
                  dispatch(editSpotLight({ id: spotlight.id, x: x / scalingX, y: y / scalingY }));
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
                      width: node.width() * scaleX / scalingX,
                      height: node.height() * scaleY / scalingY,
                    })
                  );
                }}
              />
            </Group>
          ))}
          {zooms.map((zoom) => (
            <Rect
              key={zoom.id}
              id={zoom.id}
              x={zoom.roi.x * scalingX}
              y={zoom.roi.y * scalingY}
              width={zoom.roi.width * scalingX}
              height={zoom.roi.height * scalingY}
              stroke={'#000000'}
              strokeWidth={2}
              dash={[4, 3]}
              draggable
              visible={zoom.start_time <= currentPlayTime && zoom.end_time >= currentPlayTime}
              onClick={() => {
                setSelectedId(zoom.id);
                dispatch(setCurrentElementId({ type: 'zoom', id: zoom.id }));
              }}
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                dispatch(editZoom({ id: zoom.id, roi: { ...zoom.roi, x: x / scalingX, y: y / scalingY } }));
              }}
              onTransformEnd={(e) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                const newWidth = node.width() * scaleX / scalingX;
                const newHeight = node.height() * scaleY / scalingY;
                dispatch(editZoom({ id: zoom.id, roi: { ...zoom.roi, width: newWidth, height: newHeight } }));
              }}
            />
          ))}

          <Transformer ref={transformerRef}
            rotateEnabled={true}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default ElementsOverlay;

const BlurOverlay = ({ rect, played }) => {
  if (rect.startTime <= played && rect.endTime >= played) {
    return (
      <div
        className="blur-overlay"
        style={{
          position: "absolute",
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height,
          backdropFilter: "blur(10px)", // Apply blur effect
          pointerEvents: "none", // Allow interactions through the blur
        }}
      ></div>
    );
  }

};

