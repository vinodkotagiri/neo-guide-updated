//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addSpotLight, deleteSpotLight, editSpotLight, setCurrentElement, setCurrentElementId, SpotElementElementState } from '../../../redux/features/elementsSlice'
import { setAddingElements } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const SpotlightOptions = ({ playerRef }) => {
  const { currentElementId, spotLights, currentElement } = useAppSelector(state => state.elements)
  const { currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const strokeColorRef = useRef<HTMLInputElement>(null)
  const [strokeColor, setStrokeColor] = useState('#fff')
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [cornerRadius, setCornerRadius] = useState([1, 1, 1, 1])
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [activeId, setActiveId] = useState(null)

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'spotlight' }))
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
    setEndTime(currentPlayTime + 5)
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
      </div>
      <div className='w-full flex' style={spotLights.length == 0 ? {} : { display: 'none' }}>
        <button className='cursor-pointer bg-[#422ad5]  rounded-lg text-white mx-auto px-3 py-2 mt-4 flex items-center gap-2' onClick={handleAddNewRectangle} ><FaPlus /> Add New Text</button>
      </div>
      <div className='border-b-[#303032] border-b    w-full flex flex-col gap-2 p-3 pt-0' style={spotLights.length == 0 ? { display: 'none' } : {}}>
        {/* STROKE WIDTH */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-[#a3a3a5] text-sm text-nowrap'>Shadow Spread</label>
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
          <input
            className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
            type='range'
            value={cornerRadius[0]}
            onChange={(e) => setCornerRadius([e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber])}
          />
        </div>


        {/* TIMES */}
        {spotLights.map(spotlight => (
          <div className='w-full flex  gap-2 p-3   justify-between  cursor-pointer hover:bg-[#212025]'
            style={activeId == spotlight.id ? { backgroundColor: '#212025' } : {}}
            key={spotlight.id}
            onClick={() => handleClick(spotlight)}
          >
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>
              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(spotlight.startTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(spotlight.endTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteSpotLight({ id: spotlight.id }))}> <FaRegTrashAlt /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpotlightOptions
