// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { Arrow, Layer, Rect, Group, Stage, Text, Transformer } from 'react-konva';
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
  // Cursor event handlers for elements
  const addCursorEvents = (node, type) => {
    node.on('mouseover', () => {
      if (stageRef.current) {
        stageRef.current.container().style.cursor = 'pointer';
      }
    });
    node.on('mouseout', () => {
      if (stageRef.current) {
        stageRef.current.container().style.cursor = 'default';
      }
    });
    node.on('dragstart', () => {
      if (stageRef.current) {
        stageRef.current.container().style.cursor = 'grabbing';
      }
    });
    node.on('dragend', () => {
      if (stageRef.current) {
        stageRef.current.container().style.cursor = 'pointer';
      }
    });
    // Only add transform cursor for non-text elements (texts can't resize)
    if (type !== 'text') {
      node.on('transformstart', () => {
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 'move';
        }
      });
      node.on('transformend', () => {
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 'pointer';
        }
      });
    }
  };


  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {blurs.map((rect) => (
        <BlurOverlay key={rect.id} rect={rect} played={played} scalingX={scalingX} scalingY={scalingY} />
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
              onMount={(node) => addCursorEvents(node, 'rectangle')}
            />
          ))}
          {blurs.map((rect) => (
            <Rect
              ref={blurRectRef}
              key={rect.id}
              id={rect.id}
              x={rect.x * scalingX}
              y={rect.y * scalingY}
              fill={'transparent'}
              // stroke={"#000000"}
              width={rect.width * scalingX}
              height={rect.height * scalingY}
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
              onMount={(node) => addCursorEvents(node, 'blur')}
            />
          ))}
          {texts.map((textElement) => {
            return (
              <Group
                key={textElement.id}
                id={textElement.id}
                x={textElement.x  * scalingX} // Center x
                y={textElement.y  * scalingY} // Center y
                offsetX={(textElement.width || 100) * scalingX / 2} // Rotation around center
                offsetY={(textElement.height || textElement.fontSize) * scalingY / 2}
                draggable
                rotation={textElement.rotation}
                visible={textElement.startTime <= played && textElement.endTime >= played}
                onDragStart={(e) => {
                  const { x, y } = e.target.position();
                  const newX = x / scalingX - (textElement.width || 100) / 2;
                  const newY = y / scalingY - (textElement.height || textElement.fontSize) / 2;
                  dispatch(editText({ id: textElement.id, x: newX, y: newY }));
                }}
                onDragEnd={
                  (e) => {
                    const { x, y } = e.target.position();
                    const newX = x / scalingX - (textElement.width || 100) / 2;
                    const newY = y / scalingY - (textElement.height || textElement.fontSize) / 2;
                    dispatch(editText({ id: textElement.id, x: newX, y: newY }));
                  }
                }
                onClick={() => {
                  setSelectedId(textElement.id);
                  dispatch(setCurrentElementId({ type: 'text', id: textElement.id }));
                }}
                // onDragEnd={(e) => {
                //   const { x, y } = e.target.position();
                //   const newX = x / scalingX - (textElement.width || 100) / 2;
                //   const newY = y / scalingY - (textElement.height || textElement.fontSize) / 2;
                //   dispatch(editText({ id: textElement.id, x: newX, y: newY }));
                // }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  const currentScaleX = node.scaleX();
                  const currentScaleY = node.scaleY();
                  const rotation = node.rotation();

                  // Calculate new absolute dimensions and font size
                  // Assume textElement.width and textElement.height from your state are the
                  // base (unscaled) dimensions for the current state of the text.
                  const newWidth = textElement.width * currentScaleX;
                  const newHeight = textElement.height * currentScaleY;

                  // For font size, use the maximum of the two scales to ensure proportional scaling
                  const newFontSize = textElement.fontSize * Math.max(currentScaleX, currentScaleY);
                  const roundedFontSize = Math.round(newFontSize); // Or parseFloat((newFontSize).toFixed(1));

                  // Get the new position of the Konva node after the transform
                  const newX = node.x();
                  const newY = node.y();

                  // --- Calculate backgroundWidth and backgroundHeight ---
                  // If the background is tied to the text element's new dimensions,
                  // then newWidth and newHeight are your background dimensions.
                  // If the background has a separate, constant scaling factor or padding,
                  // you'd apply that here.
                  // For simplicity, let's assume background matches text element's new dimensions.
                  const backgroundWidth = newWidth; // Assuming background width scales with text width
                  const backgroundHeight = newHeight; // Assuming background height scales with text height

                  // Reset the Konva node's scale and position to reflect the new dimensions
                  // This is crucial: set the actual visual node's properties based on the calculated values
                  // so it's ready for the *next* transformation.
                  node.scaleX(1);
                  node.scaleY(1);
                  node.x(newX);
                  node.y(newY);

                  // Dispatch the action to update your Redux state
                  dispatch(
                    editText({
                      id: textElement.id,
                      rotation,
                      fontSize: roundedFontSize,
                      width: newWidth,
                      height: newHeight,
                      // x: newX,
                      // y: newY,
                      backgroundWidth: backgroundWidth, // Dispatch background width
                      backgroundHeight: backgroundHeight, // Dispatch background height
                      // If you are using boundsX and boundsY for internal text layout,
                      // you might need to re-evaluate them based on newWidth/Height.
                      // boundsX: -newWidth / 2, // Example if origin is center
                      // boundsY: (some_calculation_based_on_new_height_or_node_getClientRect_y),
                    })
                  );
                }}
                onMount={(node) => addCursorEvents(node, 'text')}
              >
                {(textElement.backgroundColor || (textElement.backgroundGradientStartColor && textElement.backgroundGradientEndColor)) && (
                  <Rect
                    ref={(node) => {
                      if (node) {
                        const textNode = node.getStage()?.findOne(`#text-${textElement.id}`);
                        if (textNode) {
                          const textWidth = textNode.getTextWidth();
                          node.width(textWidth);
                        }
                      }
                    }}
                    x={textElement.boundsX * scalingX || 0}
                    y={textElement.boundsY * scalingY || 0}
                    width={textElement.width * scalingX || 100 * scalingX} // Use stored width
                    height={textElement.height * scalingY || textElement.fontSize}
                    cornerRadius={4}
                    fill={
                      textElement.backgroundType === 'gradient'
                        ? undefined
                        : textElement.backgroundColor
                    }
                    // LINEAR GRADIENT (horizontal, vertical, diagonal)
                    fillLinearGradientStartPoint={
                      textElement.gradientDirection === 'horizontal'
                        ? { x: 0, y: 0 }
                        : textElement.gradientDirection === 'vertical'
                          ? { x: 0, y: 0 }
                          : textElement.gradientDirection === 'diagonal'
                            ? { x: 0, y: 0 }
                            : undefined
                    }
                    fillLinearGradientEndPoint={
                      textElement.gradientDirection === 'horizontal'
                        ? { x: (textElement.width || 100) * scalingX, y: 0 }
                        : textElement.gradientDirection === 'vertical'
                          ? { x: 0, y: (textElement.height || textElement.fontSize) * scalingY }
                          : textElement.gradientDirection === 'diagonal'
                            ? {
                              x: (textElement.width || 100) * scalingX,
                              y: (textElement.height || textElement.fontSize) * scalingY,
                            }
                            : undefined
                    }
                    fillLinearGradientColorStops={
                      (textElement.gradientDirection === 'horizontal' ||
                        textElement.gradientDirection === 'vertical' ||
                        textElement.gradientDirection === 'diagonal') &&
                        textElement.backgroundGradientStartColor &&
                        textElement.backgroundGradientEndColor
                        ? [0, textElement.backgroundGradientStartColor, 1, textElement.backgroundGradientEndColor]
                        : undefined
                    }

                    // RADIAL GRADIENT
                    fillRadialGradientStartPoint={
                      textElement.gradientDirection === 'radial' ? {
                        x: (textElement.width || 100) * scalingX / 2,
                        y: (textElement.height || textElement.fontSize) * scalingY / 2
                      } : undefined
                    }
                    fillRadialGradientEndPoint={
                      textElement.gradientDirection === 'radial' ? {
                        x: (textElement.width || 100) * scalingX / 2,
                        y: (textElement.height || textElement.fontSize) * scalingY / 2
                      } : undefined
                    }
                    fillRadialGradientStartRadius={
                      textElement.gradientDirection === 'radial' ? 0 : undefined
                    }
                    fillRadialGradientEndRadius={
                      textElement.gradientDirection === 'radial'
                        ? Math.sqrt(
                          Math.pow((textElement.width || 100) * scalingX / 2, 2) +
                          Math.pow((textElement.height || textElement.fontSize) * scalingY / 2, 2)
                        )
                        : undefined
                    }
                    fillRadialGradientColorStops={
                      textElement.gradientDirection === 'radial' &&
                        textElement.backgroundGradientStartColor &&
                        textElement.backgroundGradientEndColor
                        ? [0, textElement.backgroundGradientStartColor, 1, textElement.backgroundGradientEndColor]
                        : undefined
                    }

                  />
                )}
                <Text
                  id={`text-${textElement.id}`}
                  text={textElement.text}
                  fontFamily={textElement.font}
                  fontSize={textElement.fontSize}
                  fill={textElement.fontColor}
                  align="center"
                  verticalAlign='middle'
                  rotation={0} // Rotation handled by Group
                  onMount={(node) => {
                    if (node && (textElement.width === undefined || textElement.height === undefined || textElement.boundsX === undefined)) {
                      const textWidth = node.getTextWidth();
                      const rect = node.getClientRect({ relativeTo: node.getParent() });
                      const width = textWidth / scalingX;
                      const height = rect.height / scalingY;
                      const boundsX = -width / 2;
                      const boundsY = rect.y / scalingY;
                      dispatch(editText({ id: textElement.id, width, height, boundsX, boundsY }));
                    }
                  }}
                />
              </Group>
            );
          })}
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
              onMount={(node) => addCursorEvents(node, 'arrow')}
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
                onMount={(node) => addCursorEvents(node, 'spotlight')}
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
              onMount={(node) => addCursorEvents(node, 'zoom')}
            />
          ))}

          <Transformer ref={transformerRef}
            rotateEnabled={selectedId && arrows.some(arrow => arrow.id === selectedId) || selectedId && texts.some(text => text.id === selectedId) ? true : false}
            flipEnabled={false}
            enabledAnchors={selectedId && texts.some(text => text.id === selectedId) ? ['bottom-center', 'middle-right', 'bottom-right'] : ['top-left', 'top-right', 'bottom-left', 'bottom-right']}
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

const BlurOverlay = ({ rect, played, scalingX, scalingY }) => {
  if (rect.startTime <= played && rect.endTime >= played) {
    return (
      <div
        className="blur-overlay"
        style={{
          position: "absolute",
          top: rect.y * scalingY,
          left: rect.x * scalingX,
          width: rect.width * scalingX,
          height: rect.height * scalingY,
          backdropFilter: "blur(10px)", // Apply blur effect
          pointerEvents: "none", // Allow interactions through the blur
        }}
      ></div>
    );
  }

};

