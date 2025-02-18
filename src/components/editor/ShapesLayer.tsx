import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { editArrow, editBlur, editRectangle, editSpotLight, editText, setCurrentElementId } from '../../redux/features/elementsSlice'

function ShapesLayer({ onSeek }) {
  const { rectangles, blurs, texts, arrows, spotLights } = useAppSelector(state => state.elements)
  const dispatch = useAppDispatch()
  const [dragging, setDragging] = useState(false)
  const [draggedRect, setDraggedRect] = useState(null)
  const [initialX, setInitialX] = useState(0)
  const [initialLeft, setInitialLeft] = useState(0)
  const [initialDuration, setInitialDuration] = useState(0)

  // const handleDragStart = (e, rect) => {
  //   setDragging(true)
  //   setDraggedRect(rect)
  //   setInitialX(e.clientX) // Get initial mouse position
  //   setInitialLeft(rect.startTime * 10) // Initial position of the rectangle
  //   setInitialDuration(rect.endTime - rect.startTime)
  // }


  // const handleDrag = (e, shape) => {
  //   const deltaX = e.clientX - initialX; // Calculate horizontal movement
  //   const newLeft = initialLeft + deltaX; // Calculate new left position
  //   const newStartTime = Math.max(0, newLeft / 10); // Ensure startTime is not negative
  //   const newEndTime = newStartTime + initialDuration; // Maintain duration
  //   if ((newEndTime - newStartTime )==initialDuration) {
  //     setDraggedRect((prev) => ({
  //       ...prev,
  //       startTime: newStartTime,
  //       endTime: newEndTime,
  //     })); // Update local state for smooth drag feedback

  //     if (shape === "rectangle")
  //       dispatch(editRectangle({ id: draggedRect.id, startTime: newStartTime, endTime: newEndTime }));
  //     else if (shape === "blur")
  //       dispatch(editBlur({ id: draggedRect.id, startTime: newStartTime, endTime: newEndTime }));
  //     else if (shape === "text")
  //       dispatch(editText({ id: draggedRect.id, startTime: newStartTime, endTime: newEndTime }));
  //     else if (shape === "arrow")
  //       dispatch(editArrow({ id: draggedRect.id, startTime: newStartTime, endTime: newEndTime }));
  //     else if (shape === "spotlight")
  //       dispatch(editSpotLight({ id: draggedRect.id, startTime: newStartTime, endTime: newEndTime }));
  //   }
  // };
  // const handleDragEnd = () => {
  //   setDragging(false);
  //   setDraggedRect(null);
  //   setInitialX(0);
  //   setInitialLeft(0);
  // }

  return (
    <div className="relative top-12 w-full h-64 rounded-md overflow-hidden">
      {blurs?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute group h-6 bg-blue-500  rounded-md border-[1px] border-slate-600 cursor-pointer opacity-75 tooltip" data-tip={'blur'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
            // onDragStart={(e) => handleDragStart(e, rect)}
            // onDrag={(e) => handleDrag(e, 'blur')}
            // onDragEnd={handleDragEnd}
            onClick={() => {
              dispatch(setCurrentElementId({ id: rect.id, type: 'blur' }))
              onSeek(rect.startTime)
            }}
          // draggable
          >
            <span className='flex items-center justify-center capitalize'>blur</span>

            <div className='absolute top-0 left-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>
            <div className='absolute top-0 right-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>

          </div>
        )
      })}
      {rectangles?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute group top-6 h-6 bg-green-500 rounded-md border-[1px] border-slate-600 cursor-pointer opacity-75 tooltip" data-tip={'rectangle'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
            // onDragStart={(e) => handleDragStart(e, rect)}
            // onDrag={(e) => handleDrag(e, 'rectangle')}
            // onDragEnd={handleDragEnd}
            onClick={() => {
              dispatch(setCurrentElementId({ id: rect.id, type: 'rectangle' }))
              onSeek(rect.startTime)
            }}
          // draggable
          >
            <span className='flex items-center justify-center capitalize'>rect</span>
            <div className='absolute top-0 left-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>
            <div className='absolute top-0 right-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>

          </div>
        )
      })}
      {texts?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute group top-12 h-6 bg-amber-950  rounded-md border-[1px] border-slate-600 cursor-pointer   tooltip" data-tip={'text'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
            // onDragStart={(e) => handleDragStart(e, rect)}
            // onDrag={(e) => handleDrag(e, 'text')}
            // onDragEnd={handleDragEnd}
            onClick={() => {
              dispatch(setCurrentElementId({ id: rect.id, type: 'text' }))
              onSeek(rect.startTime)
            }}
          // draggable
          >
            <span className='flex items-center justify-center capitalize text-white'>text</span>
            <div className='absolute top-0 left-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>
            <div className='absolute top-0 right-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>

          </div>
        )
      })}
      {arrows?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute group top-18 h-6 bg-red-500 rounded-md border-[1px] border-slate-600 cursor-pointer opacity-75 tooltip" data-tip={'text'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
            // onDragStart={(e) => handleDragStart(e, rect)}
            // onDrag={(e) => handleDrag(e, 'arrow')}
            // onDragEnd={handleDragEnd}
            onClick={() => {
              dispatch(setCurrentElementId({ id: rect.id, type: 'arrow' }))
              onSeek(rect.startTime)
            }}
          // draggable
          >
            <span className='flex items-center justify-center capitalize'>arrow</span>
            <div className='absolute top-0 left-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>
            <div className='absolute top-0 right-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>

          </div>
        )
      })}
      {spotLights?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute group top-24 h-6 bg-purple-500 rounded-md border-[1px] border-slate-600 cursor-pointer opacity-75 tooltip" data-tip={'text'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
            }}
            // onDragStart={(e) => handleDragStart(e, rect)}
            // onDrag={(e) => handleDrag(e, 'arrow')}
            // onDragEnd={handleDragEnd}
            onClick={() => {
              dispatch(setCurrentElementId({ id: rect.id, type: 'spotlight' }))
              onSeek(rect.startTime)
            }}
          // draggable
          >
            <span className='flex items-center justify-center capitalize'>spot</span>
            <div className='absolute top-0 left-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>
            <div className='absolute top-0 right-0 h-full w-2 bg-slate-400  group-hover:flex items-center justify-center cursor-ew-resize hidden'>
              <span className='text-black'>|</span>
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default ShapesLayer