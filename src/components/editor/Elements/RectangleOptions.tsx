import React, { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addRectangle, deleteRectangle, editRectangle, RectangleElementState, setCurrentElement } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'

const RectangleOptions = () => {
  const { currentElementId, rectangles } = useAppSelector(state => state.elements)
  const { duration } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const strokeColorRef = useRef<HTMLInputElement>(null)
  const fillColorRef = useRef<HTMLInputElement>(null)
  const [strokeColor, setStrokeColor] = useState('#fff')
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [cornerRadius, setCornerRadius] = useState([1, 1, 1, 1])
  const [fillColor, setFillColor] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const handleSetTransparent = () => {
    setFillColor('transparent')
  }
  const handleStrokeColorPickerClick = () => {
    if (strokeColorRef.current) {
      strokeColorRef.current.click()
    }
  }

  const handleFillColorPickerClick = () => {
    if (fillColorRef.current) {
      fillColorRef.current.click()
    }
  }

  function handleAddNewRectangle() {
    dispatch(setAddingElements(true))
    const rectData: RectangleElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      strokeColor: '#fff',
      strokeWidth: 3,
      cornerRadius: [1, 1, 1, 1],
      fillColor: 'transparent',
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addRectangle(rectData))
    dispatch(setCurrentElement('rectangle'))
  }


  useEffect(() => {
    if (currentElementId) {
      const rectData = rectangles.find(rect => rect.id === currentElementId)
      if (rectData) {
        setStrokeColor(rectData.strokeColor)
        setStrokeWidth(rectData.strokeWidth)
        setCornerRadius(rectData?.cornerRadius)
        setFillColor(rectData.fillColor)
      }
    }
  }, [currentElementId, rectangles])


  useEffect(() => {
    dispatch(editRectangle({ id: currentElementId, strokeColor, strokeWidth, fillColor, cornerRadius }))
  }, [strokeColor, strokeWidth, fillColor, cornerRadius])
  return (
    <div className='w-full h-full py-4 px-2 flex flex-col gap-3 relative'>
      <div className='flex font-semibold text-slate-500 absolute'>
        <MdChevronLeft size={24} className='cursor-pointer' onClick={() => dispatch(setCurrentElement(null))} /></div>
      <div className='flex items-center justify-between w-full h-6 px-6'>
        <div className='flex font-semibold text-slate-500'>
          {/* <MdChevronLeft size={24} className='cursor-pointer' onClick={() => dispatch(setCurrentElement(null))} /> */}
          <span>Rectangle</span>
        </div>
        <button onClick={handleAddNewRectangle} className='btn btn-success btn-xs outline-none border-none shadow-none'>
          New
        </button>
        <button className='cursor-pointer' onClick={() => dispatch(deleteRectangle({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button>
      </div>

      <div className='w-full flex flex-col gap-2 p-3 bg-slate-700 rounded-md'>

        {/* STROKE COLOR */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Stroke Color</label>
          <button onClick={handleStrokeColorPickerClick} className="cursor-pointer">
            <IoMdColorPalette color={strokeColor} size={24} />
          </button>
          <input
            ref={strokeColorRef}
            type='color'
            className='hidden'
            onChange={e => setStrokeColor(e.target.value)}
          />
        </div>
        {/* STROKE WIDTH */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Stroke Width</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
          />
        </div>
        {/* FILL COLOR */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Fill Color</label>
          <div className='flex gap-4'>
            <button onClick={handleSetTransparent} className="cursor-pointer tooltip" data-tip='transparent'>
              <BsTransparency color={'#00000090'} size={24} />
            </button>
            <button onClick={handleFillColorPickerClick} className="cursor-pointer">
              <IoMdColorPalette color={fillColor == 'transparent' ? '#00000090' : fillColor ?? '#fff'} size={24} />
            </button>
          </div>
          <input
            ref={fillColorRef}
            type='color'
            className='hidden'
            onChange={e => setFillColor(e.target.value)}
          />
        </div>
        {/* BORDER RADIUS */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Border Radius</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            min={0}
            max={50}
            value={cornerRadius[0]}
            onChange={(e) => setCornerRadius([e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber])}
          />
        </div>
      </div>
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
            min={0}
            max={duration}
            value={endTime}
            onChange={(e) => setEndTime(e.target.valueAsNumber)}
          />
        </div>
      </div>
    </div>
  )
}

export default RectangleOptions
