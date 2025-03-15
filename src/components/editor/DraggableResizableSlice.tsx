import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  editArrow, 
  editBlur, 
  editRectangle, 
  editSpotLight, 
  editText, 
  editZoom, 
  setCurrentElementId 
} from '../../redux/features/elementsSlice';

// Define prop types
interface DraggableResizableSliceProps {
  playerRef: React.RefObject<any>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  layerRef: React.RefObject<HTMLDivElement>;
  sliceRef: React.RefObject<HTMLDivElement>;
  label: string;
  shapeType: 'rectangle' | 'spotlight' | 'blur' | 'text' | 'arrow' | 'zoom';
  shape: any; // You might want to define a more specific shape type
  color?: string;
}


const DraggableResizableSlice = ({
  playerRef,
  wrapperRef,
  layerRef,
  sliceRef,
  label,
  shapeType,
  shape,
  color = '#02BC7D'
}: DraggableResizableSliceProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [sliceStyle, setSliceStyle] = useState({ left: 0, width: 0 });
  
  const dispatch = useAppDispatch();
  const { pixelFactor } = useAppSelector(state => state.video);
  
  const scrollSpeed = 5;
  const minWidth = 5;
  const edgeThreshold = 50;

  // Initialize slice position
  useEffect(() => {
    if (!shape) return;
    
    const startTime = shape.startTime ?? shape.start_time ?? 0;
    const endTime = shape.endTime ?? shape.end_time ?? 0;
    
    if (startTime !== undefined && endTime !== undefined) {
      const width = (endTime - startTime) * pixelFactor;
      const left = startTime * pixelFactor;
      setSliceStyle({ left, width });
    }
  }, [shape, shapeType, pixelFactor]);

  // Update Redux store
  useEffect(() => {
    if (!shape?.id) return;
    
    const startTime = sliceStyle.left / pixelFactor;
    const endTime = (sliceStyle.left + sliceStyle.width) / pixelFactor;

    const updateActions = {
      rectangle: editRectangle,
      spotlight: editSpotLight,
      blur: editBlur,
      text: editText,
      arrow: editArrow,
      zoom: editZoom
    };

    const action = updateActions[shapeType];
    if (action) {
      try {
        dispatch(action({
          id: shape.id,
          ...(shapeType === 'zoom' 
            ? { start_time: startTime, end_time: endTime }
            : { startTime, endTime })
        }));
      } catch (error) {
        console.error(`Failed to dispatch ${shapeType} update:`, error);
      }
    }
  }, [sliceStyle, shapeType, shape, dispatch, pixelFactor]);

  const onShapeClick = () => {
    if (!shape?.id || !playerRef.current) return;
    dispatch(setCurrentElementId({ id: shape.id, type: shapeType }));
    playerRef.current.seekTo(shape.startTime ?? shape.start_time ?? 0);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const className = (e.target as HTMLElement).className;
    setLastX(e.clientX);

    if (typeof className === 'string') {
      if (className.includes('resize-handle left')) {
        setIsResizingLeft(true);
      } else if (className.includes('resize-handle right')) {
        setIsResizingRight(true);
      } else {
        setIsMouseDown(true);
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!(isMouseDown || isResizingLeft || isResizingRight) || !layerRef.current) return;

    const deltaX = e.clientX - lastX;
    const currentLeft = sliceStyle.left;
    const currentWidth = sliceStyle.width;
    const layerWidth = layerRef.current.offsetWidth * pixelFactor;

    let newLeft = currentLeft;
    let newWidth = currentWidth;

    try {
      if (isResizingLeft) {
        newLeft = currentLeft + deltaX;
        newWidth = currentWidth - deltaX;
        if (newWidth < minWidth * pixelFactor) {
          newWidth = minWidth * pixelFactor;
          newLeft = currentLeft + currentWidth - (minWidth * pixelFactor);
        }
        if (newLeft < 0) {
          newLeft = 0;
          newWidth = currentLeft + currentWidth;
        }
      } else if (isResizingRight) {
        newWidth = currentWidth + deltaX;
        const maxWidth = layerWidth - currentLeft;
        newWidth = Math.max(minWidth * pixelFactor, Math.min(maxWidth, newWidth));
      } else if (isMouseDown) {
        newLeft = currentLeft + deltaX;
        const maxLeft = layerWidth - currentWidth;
        newLeft = Math.max(0, Math.min(maxLeft, newLeft));
      }

      setSliceStyle({ left: newLeft, width: newWidth });
      
      // Auto-scroll logic
      if (wrapperRef.current && sliceRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const sliceRect = sliceRef.current.getBoundingClientRect();
        const maxScrollX = wrapperRef.current.scrollWidth - wrapperRect.width;

        const sliceLeftRelative = sliceRect.left - wrapperRect.left;
        const sliceRightRelative = wrapperRect.right - sliceRect.right;

        if (sliceLeftRelative < edgeThreshold && wrapperRef.current.scrollLeft > 0) {
          wrapperRef.current.scrollLeft -= scrollSpeed;
        } else if (sliceRightRelative < edgeThreshold && wrapperRef.current.scrollLeft < maxScrollX) {
          wrapperRef.current.scrollLeft += scrollSpeed;
        }
      }
      
      setLastX(e.clientX);
    } catch (error) {
      console.error('Error in mouse move handling:', error);
    }
  }, [isMouseDown, isResizingLeft, isResizingRight, lastX, sliceStyle, pixelFactor, layerRef, wrapperRef, sliceRef]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!shape) return null;

  return (
    <div
      className="h-full absolute cursor-grab select-none flex items-center justify-center capitalize text-xs rounded-sm border-l-2 border-slate-200 border-r-2"
      ref={sliceRef}
      style={{ 
        left: sliceStyle.left, 
        width: sliceStyle.width, 
        backgroundColor: color 
      }}
      onMouseDown={handleMouseDown}
      onClick={onShapeClick}
    >
      {sliceStyle.width > 120 && (
        <p className="font-semibold text-white">
          {label} <span>{Number(sliceStyle.width / pixelFactor).toFixed(2)}s</span>
        </p>
      )}
      <div 
        className="resize-handle left rounded-l-sm"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '10px',
          height: '100%',
          cursor: 'ew-resize',
        }}
      />
      <div 
        className="resize-handle right rounded-r-sm"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '10px',
          height: '100%',
          cursor: 'ew-resize',
        }}
      />
    </div>
  );
};

export default DraggableResizableSlice;