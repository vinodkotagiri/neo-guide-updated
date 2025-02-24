//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addRectangle, addSpotLight, deleteRectangle, deleteSpotLight, editRectangle, editSpotLight, RectangleElementState, setCurrentElement, SpotElementElementState } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const SpotlightOptions = ({ playerRef }) => {
  const { currentElementId, spotLights, currentElement } = useAppSelector(state => state.elements)
  const { duration, currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const strokeColorRef = useRef<HTMLInputElement>(null)
  const [strokeColor, setStrokeColor] = useState('#fff')
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [cornerRadius, setCornerRadius] = useState([1, 1, 1, 1])
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)



  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
  }, [])

  useEffect(() => {
    if (currentElementId) {
      const rectData = spotLights.find(rect => rect.id === currentElementId)
      if (rectData) {
        setStrokeColor(rectData.glowColor)
        setStrokeWidth(rectData.glowRadius)
        setCornerRadius(rectData?.cornerRadius)
        setStartTime(rectData.startTime)
        setEndTime(rectData.endTime)
      }
    }
  }, [currentElementId, spotLights])

  const handleStrokeColorPickerClick = () => {
    if (strokeColorRef.current) {
      strokeColorRef.current.click()
    }
  }

  function handleAddNewRectangle() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
    dispatch(setAddingElements(true))
    const rectData: SpotElementElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      glowColor: '#fff',
      glowRadius: 50,
      cornerRadius: [50, 50, 50, 50],
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addSpotLight(rectData))
    dispatch(setCurrentElement('spotlight'))
  }


  useEffect(() => {
    if (currentElementId) {
      const spotlightData = spotLights.find(rect => rect.id === currentElementId)
      if (spotlightData) {
        setStrokeColor(spotlightData.glowColor)
        setStrokeWidth(spotlightData.glowRadius)
        setCornerRadius(spotlightData?.cornerRadius)
        setStartTime(spotlightData.startTime)
        setEndTime(spotlightData.endTime)
      }
    }
  }, [currentElementId, spotLights])


  useEffect(() => {
    if (currentElementId && currentElement == 'spotlight') {
      dispatch(editSpotLight({ id: currentElementId, glowColor: strokeColor, glowRadius: strokeWidth, cornerRadius, startTime, endTime }))
    }
  }, [strokeColor, strokeWidth, cornerRadius, startTime, endTime])



  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative'>

      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex   text-[#fff] text-[14px]'>
          Spot Light
        </div>
        <button onClick={handleAddNewRectangle} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
          <FaPlus />

        </button>
        {/* <button className='cursor-pointer' onClick={() => dispatch(deleteSpotLight({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button> */}
      </div>

      <div className='border-b-[#303032] border-b    w-full flex flex-col gap-2 p-3 pt-0'>

        {/* STROKE COLOR */}
        {/* <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Shadow Color</label>
          <button onClick={handleStrokeColorPickerClick} className="cursor-pointer">
            <IoMdColorPalette color={strokeColor} size={24} />
          </button>
          <input
            ref={strokeColorRef}
            type='color'
            className='hidden'
            onChange={e => setStrokeColor(e.target.value)}
          />
        </div> */}
        {/* STROKE WIDTH */}

        <div className='flex items-center justify-between w-full'>
          <label className='text-[#a3a3a5] text-sm text-nowrap'>Shadow Spread</label>
          {/* <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            min={0}
            max={200}
            onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
            value={strokeWidth}
          /> */}
          <input
            className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
            type='range'
            onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
            value={strokeWidth}
          />
        </div>

        {/* BORDER RADIUS */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-[#a3a3a5] text-sm text-nowrap'>Border Radius</label>
          {/* <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            min={0}
            max={100}
            value={cornerRadius[0]}
            onChange={(e) => setCornerRadius([e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber])}
          /> */}
          <input
            className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
            type='range'
            value={cornerRadius[0]}
            onChange={(e) => setCornerRadius([e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber])}
          />
        </div>


        {/* TIMES */}
        <div className='w-full flex  gap-2 pt-3   justify-between  '>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>
            {/* <input
              className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
              type='number'
              min={0}
              max={duration}
              value={startTime}
              onChange={(e) => setStartTime(e.target.valueAsNumber)}
            /> */}
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(startTime).toFixed(2)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
            {/* <input
              className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
              type='number'
              min={0}
              max={duration}
              value={endTime}
              onChange={(e) => setEndTime(e.target.valueAsNumber)}
            /> */}<span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(endTime).toFixed(2)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteSpotLight({ id: currentElementId }))}> <FaRegTrashAlt /></label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotlightOptions
