import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../redux/hooks';
import { editArrow, editBlur, editRectangle, editSpotLight, editText, setCurrentElementId } from '../../redux/features/elementsSlice';


const DraggableResizableSlice = ({ playerRef, wrapperRef, layerRef, sliceRef, label, shapeType, shape, color = '#02BC7D' }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [lastX, setLastX] = useState(0);
  const dispatch = useAppDispatch()
  const [sliceStyle, setSliceStyle] = useState({ left: 0, width: 0 });
  const scrollSpeed = 5;
  const minWidth = 20;
  const edgeThreshold = 50;

  useEffect(() => {
    if (shape.startTime != undefined && shape.endTime != undefined) {
      const startTime = shape.startTime, endTime = shape.endTime
      const width = ((endTime - startTime)) * 8;
      const left = (startTime) * 8;
      setSliceStyle({ left, width })
    }
  }, [shape])


  useEffect(() => {
    const startTime = sliceStyle.left / 8, endTime = (sliceStyle.left + sliceStyle.width) / 8
    if (shapeType == 'rectangle') {
      dispatch(editRectangle({ id: shape.id, startTime, endTime }))
    }
    else if (shapeType == 'spotlight') {
      dispatch(editSpotLight({ id: shape.id, startTime, endTime }))
    }
    else if (shapeType == 'blur') {
      dispatch(editBlur({ id: shape.id, startTime, endTime }))
    }
    else if (shapeType == 'text') {
      dispatch(editText({ id: shape.id, startTime, endTime }))
    }
    else if (shapeType == 'arrow') {
      dispatch(editArrow({ id: shape.id, startTime, endTime }))
    }
  }, [sliceStyle])


  const onShapeClick = () => {
    dispatch(setCurrentElementId({ id: shape.id, type: shapeType }))
    playerRef.current.seekTo(shape.startTime)
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    const targetClass = e.target.className;

    if (targetClass.includes('resize-handle left')) {
      setIsResizingLeft(true);
    } else if (targetClass.includes('resize-handle right')) {
      setIsResizingRight(true);
    } else {
      setIsMouseDown(true);
    }
    setLastX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  const handleMouseMove = (e) => {
    if (!(isMouseDown || isResizingLeft || isResizingRight)) return;

    const deltaX = e.clientX - lastX;
    const currentLeft = Number(sliceStyle.left)||0;
    const currentWidth = Number(sliceStyle.width )||50;
    const layerWidth = layerRef.current.offsetWidth;

    let newLeft = currentLeft;
    let newWidth = currentWidth;

    if (isResizingLeft) {
      newLeft = currentLeft + deltaX;
      newWidth = currentWidth - deltaX;
      const maxLeft = currentLeft + currentWidth - minWidth;

      if (newWidth < minWidth) {
        newWidth = minWidth;
        newLeft = currentLeft + currentWidth - minWidth;
      }
      if (newLeft < 0) {
        newLeft = 0;
        newWidth = currentLeft + currentWidth;
      }
    } else if (isResizingRight) {
      newWidth = currentWidth + deltaX;
      const maxWidth = layerWidth - currentLeft;
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    } else if (isMouseDown) {
      newLeft = currentLeft + deltaX;
      const maxLeft = layerWidth - currentWidth;
      newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    }

    setSliceStyle({
      left: newLeft,
      width: newWidth
    });

    // Auto-scroll logic
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const sliceRect = sliceRef.current.getBoundingClientRect();
    const maxScrollX = wrapperRef.current.scrollWidth - wrapperRef.current.offsetWidth;

    const sliceLeftRelative = sliceRect.left - wrapperRect.left;
    const sliceRightRelative = wrapperRect.right - sliceRect.right;

    if (sliceLeftRelative < edgeThreshold && wrapperRef.current.scrollLeft > 0) {
      wrapperRef.current.scrollLeft -= scrollSpeed;
    } else if (sliceRightRelative < edgeThreshold && wrapperRef.current.scrollLeft < maxScrollX) {
      wrapperRef.current.scrollLeft += scrollSpeed;
    }

    setLastX(e.clientX);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMouseDown, isResizingLeft, isResizingRight, lastX]);



  return (
    <div
      className="h-full absolute cursor-grab user-select-none flex items-center justify-center capitalize text-xs rounded-lg"
      ref={sliceRef}
      style={{ left: sliceStyle.left, width: sliceStyle.width, backgroundColor: color }}
      onMouseDown={handleMouseDown}
      onClick={onShapeClick}
    >
      <p className='font-semibold text-white'>{label}&nbsp;<span >{Number(sliceStyle.width / 8).toFixed(2)}s</span></p>
      <div className='resize-handle left' style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '10px',
        height: '100%',
        backgroundColor: ' rgba(255, 255, 255, 0.5)',
        cursor: 'ew-resize',
        borderTopLeftRadius: "0.5rem",
        borderBottomLeftRadius: "0.5rem"
      }}></div>
      <div className='resize-handle right' style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '10px',
        height: '100%',
        backgroundColor: ' rgba(255, 255, 255, 0.5)',
        cursor: 'ew-resize',
        borderTopRightRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem"
      }}></div>
    </div>
  )
}

export default DraggableResizableSlice