import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { editRectangle } from '../../redux/features/elementsSlice'


function ShapesLayer() {
  const { rectangles } = useAppSelector(state => state.elements)
  const dispatch = useAppDispatch()
  const [dragging, setDragging] = useState(false)
  const [draggedRect, setDraggedRect] = useState(null)
  const [initialX, setInitialX] = useState(0)
  const [initialLeft, setInitialLeft] = useState(0)

  const handleDragStart = (e, rect) => {
    setDragging(true)
    setDraggedRect(rect)
    setInitialX(e.clientX) // Get initial mouse position
    setInitialLeft(rect.startTime * 10) // Initial position of the rectangle
  }

  const handleDrag = (e) => {
    if (!dragging || !draggedRect) return

    const deltaX = e.clientX - initialX // Calculate the distance moved
    const newLeft = Math.max(0, initialLeft + deltaX) // Ensure the left position doesn't go below 0
    const newStartTime = newLeft / 10 // Convert pixel position back to startTime
    const newEndTime = newStartTime + (draggedRect.endTime - draggedRect.startTime) // Adjust the endTime accordingly

    // Dispatch an action to update the rectangle's position
    dispatch(editRectangle({ id:draggedRect.id, startTime: newStartTime, endTime: newEndTime }))
  }

  const handleDragEnd = () => {
    setDragging(false)
    setDraggedRect(null)
    setInitialX(0)
    setInitialLeft(0)
  }

  return (
    <div className="relative top-12 w-full h-8 rounded-md overflow-hidden">
      {rectangles?.map((rect, i) => {
        const width = (rect.endTime - rect.startTime) * 10
        const left = rect.startTime * 10
        return (
          <div
            key={i}
            className="absolute bg-green-400 rounded-md border-[1px] border-slate-600 cursor-pointer opacity-35 tooltip" data-tip={'rectangle'}
            style={{
              left: `${left}px`,
              width: `${width}px`,
              height: '100%'
            }}
            onDragStart={(e) => handleDragStart(e, rect)}
            onDrag={(e) => handleDrag(e)}
            onDragEnd={handleDragEnd}
            draggable
          >
          </div>
        )
      })}
    </div>
  )
}

export default ShapesLayer
