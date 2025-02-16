import React, { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addArrow, ArrowElementState, BlurElementState, deleteArrow, deleteBlur, deleteRectangle, editArrow, editBlur, editRectangle, RectangleElementState, setCurrentElement } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'

const ArrowOptions = () => {
  const { currentElementId, arrows } = useAppSelector(state => state.elements)
  const { duration, played } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [stroke, setStroke] = useState('#fff');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [pointerLenght, setPointerLenght] = useState(10);
  const [pointerWidth, setPointerWidth] = useState(2);
  const [rotation, setRotation] = useState(0);
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const strokeColorRef = useRef<HTMLInputElement>(null)
  const handleStrokeColorPickerClick = () => {
    if (strokeColorRef.current) {
      strokeColorRef.current.click()
    }
  }


  useEffect(() => {
    setStartTime(played)
  }, [])


  function handleAddNewBlur() {
    dispatch(setAddingElements(true))
    const arrowData: ArrowElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      points: [100, 100, 50, 50],
      strokeWidth: strokeWidth,
      stroke: stroke,
      pointerLenght: pointerLenght,
      rotation: rotation,
      pointerWidth: pointerWidth,
      startTime: played,
      endTime: played + 5
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
    if (currentElementId) {
      dispatch(editArrow({ id: currentElementId, startTime: startTime, endTime: endTime, rotation, stroke, strokeWidth,pointerLenght,pointerWidth}))
    }
  }, [startTime, endTime, currentElementId, rotation,stroke,strokeWidth,pointerLenght,pointerWidth])




  return (
    <div className='w-full h-full py-4 px-2 flex flex-col gap-3 relative'>
      <div className='flex font-semibold text-slate-500 absolute'>
        <MdChevronLeft size={24} className='cursor-pointer' onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          dispatch(setCurrentElement(null))
        }} /></div>
      <div className='flex items-center justify-between w-full h-6 px-6'>
        <div className='flex font-semibold text-slate-500'>
          {/* <MdChevronLeft size={24} className='cursor-pointer' onClick={() => dispatch(setCurrentElement(null))} /> */}
          <span>Arrow</span>
        </div>
        <button onClick={handleAddNewBlur} className='btn btn-success btn-xs outline-none border-none shadow-none'>
          New
        </button>
        <button className='cursor-pointer' onClick={() => dispatch(deleteArrow({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button>
      </div>
      <div className='flex items-center justify-between w-full'>
        <label className='text-slate-400 text-sm'>Stroke Color</label>
        <button onClick={handleStrokeColorPickerClick} className="cursor-pointer">
          <IoMdColorPalette color={stroke} size={24} />
        </button>
        <input
          ref={strokeColorRef}
          type='color'
          className='hidden'
          onChange={e => setStroke(e.target.value)}
        />
      </div>
      {/* STROKE WIDTH */}
      <div className='flex items-center justify-between w-full'>
        <label className='text-slate-400 text-sm'>Stroke Width</label>
        <input
          className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
          type='range'
          onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
          value={strokeWidth}
        />
      </div>
      {/* POINTER LENGTH */}
      <div className='flex items-center justify-between w-full'>
        <label className='text-slate-400 text-sm'>Pointer Length</label>
        <input
          className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
          type='range'
          min={1}
          max={50}
          onChange={(e) => setPointerLenght(e.target.valueAsNumber)}
          value={pointerLenght}
        />
      </div>
            {/* POINTER WIDTH */}
            <div className='flex items-center justify-between w-full'>
        <label className='text-slate-400 text-sm'>Pointer Width</label>
        <input
          className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
          type='range'
          min={1}
          max={50}
          onChange={(e) => setPointerWidth(e.target.valueAsNumber)}
          value={pointerWidth}
        />
      </div>



      {/* Rotation */}
      {/* <div className='w-full flex flex-col gap-2 p-3 bg-slate-700 rounded-md'>

       
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Rotation</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            min={0}
            max={360}
            value={rotation}
            onChange={(e) => setRotation(e.target.valueAsNumber)}
          />
        </div>
      </div> */}
      {/* TIMES */}
      <div className='w-full flex flex-col gap-2 p-3 bg-slate-700 rounded-md'>
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Start Time</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='number'
            min={0}
            max={duration}
            value={startTime}
            onChange={(e) => setStartTime(e.target.valueAsNumber)}
          />
        </div>
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>End Time</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='number'
            min={startTime + 5}
            max={duration}
            value={endTime}
            onChange={(e) => setEndTime(e.target.valueAsNumber)}
          />
        </div>
      </div>
    </div>
  )
}

export default ArrowOptions
