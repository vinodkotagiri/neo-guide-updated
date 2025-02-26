//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addArrow, ArrowElementState, deleteArrow, editArrow, setCurrentElement, setCurrentElementId } from '../../../redux/features/elementsSlice'
import { setAddingElements } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const ArrowOptions = ({ playerRef }) => {
  const { currentElementId, arrows, currentElement } = useAppSelector(state => state.elements)
  const { currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [stroke, setStroke] = useState('#fff');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [pointerLength, setpointerLength] = useState(20);
  const [pointerWidth, setPointerWidth] = useState(20);
  const [rotation, setRotation] = useState(0);
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const strokeColorRef = useRef<HTMLInputElement>(null)
  const [activeId, setActiveId] = useState(null)

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'arrow' }))
    playerRef?.current?.seekTo(item.startTime)
    setActiveId(item.id)
  }

  useEffect(() => {
    setActiveId(currentElementId)
  }, [currentElementId])


  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
  }, [])

  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
    dispatch(setAddingElements(true))
    const arrowData: ArrowElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      points: [0, 0, 100, 100],
      strokeWidth: strokeWidth,
      stroke: stroke,
      pointerLength: pointerLength,
      rotation: rotation,
      pointerWidth: pointerWidth,
      startTime: currentPlayTime,
      endTime: currentPlayTime + 15
    }
    dispatch(addArrow(arrowData))
    dispatch(setCurrentElement('arrow'))
  }


  useEffect(() => {
    const currentRect = arrows.find(rect => rect.id === currentElementId)
    if (currentRect) {
      setStartTime(currentRect.startTime)
      setEndTime(currentRect.endTime)
    }
  }, [arrows, currentElementId])

  useEffect(() => {
    if (currentElementId && currentElement == 'arrow') {
      dispatch(editArrow({ id: currentElementId, startTime: startTime, endTime: endTime, rotation, stroke, strokeWidth, pointerLength, pointerWidth }))
    }
  }, [startTime, endTime, rotation, stroke, strokeWidth, pointerLength, pointerWidth])




  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative'>
      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex   text-[#fff] text-[14px]'>

          Arrow
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewBlur} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />
          </button>

        </div>
      </div>
      <div className='border-b-[#303032] border-b    '>
        <div className='w-full flex flex-col gap-2 p-3    pt-0'>
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Stroke Color</label>
            <input ref={strokeColorRef} onChange={e => setStroke(e.target.value)} type="color" className=" h-6 w-6 border-none outline-0    cursor-pointer     appearance-none" />
          </div>
          {/* STROKE WIDTH */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Stroke Width</label>
            <input
              className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
              type='range'
              onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
              value={strokeWidth}
            />
          </div>
          {/* POINTER LENGTH */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Pointer Length</label>
            <input
              className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
              type='range'
              min={1}
              max={100}
              onChange={(e) => setpointerLength(e.target.valueAsNumber)}
              value={pointerLength}
            />
          </div>
          {/* POINTER WIDTH */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Pointer Width</label>
            <input
              className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
              type='range'
              min={1}
              max={50}
              onChange={(e) => setPointerWidth(e.target.valueAsNumber)}
              value={pointerWidth}
            />
          </div>
        </div>
        {/* TIMES */}

        {arrows.map(arrow => (
          <div className='w-full flex  gap-2 p-3  justify-between  cursor-pointer hover:bg-[#212025] '
            style={activeId == arrow.id ? { backgroundColor: '#212025' } : {}}
            key={arrow.id}
            onClick={() => handleClick(arrow)}
          >
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>
              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(arrow.startTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(arrow.endTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteArrow({ id: arrow.id }))}> <FaRegTrashAlt /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArrowOptions
