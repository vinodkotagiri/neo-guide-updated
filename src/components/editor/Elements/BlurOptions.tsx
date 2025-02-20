import React, { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addBlur, addRectangle, BlurElementState, deleteBlur, deleteRectangle, editBlur, editRectangle, RectangleElementState, setCurrentElement } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'

const BlurOptions = () => {
  const { currentElementId, blurs } = useAppSelector(state => state.elements)
  const { duration,currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [blurRadius,setBlurRadius]=useState(50);
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  
useEffect(()=>{
  setStartTime(currentPlayTime)
  setEndTime(currentPlayTime+5)
},[])

  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime+5)
    dispatch(setAddingElements(true))
    const blurData: BlurElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      blurRadius:blurRadius,
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addBlur(blurData))
    dispatch(setCurrentElement('blur'))
  }

  
    useEffect(()=>{
      const currentRect=blurs.find(rect=>rect.id===currentElementId)
      console.log('currentRect')
      if(currentRect){
        setStartTime(currentRect.startTime)
        setEndTime(currentRect.endTime)
      }
    },[blurs,currentElementId])

    useEffect(()=>{
      if(currentElementId){
        dispatch(editBlur({id:currentElementId,startTime:startTime,endTime:endTime}))
      }
    },[startTime,endTime,currentElementId])


  

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
          <span>Blur</span>
        </div>
        <button onClick={handleAddNewBlur} className='btn btn-success btn-xs outline-none border-none shadow-none'>
          New
        </button>
        <button className='cursor-pointer' onClick={() => dispatch(deleteBlur({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button>
      </div>

        {/* BLUR RADIUS */}
      {/* <div className='w-full flex flex-col gap-2 p-3 bg-slate-700 rounded-md'>

       
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Border Radius</label>
          <input
            className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
            min={5}
            max={100}
            value={blurRadius}
            onChange={(e) => setBlurRadius(e.target.valueAsNumber)}
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
            min={startTime+5}
            max={duration}
            value={endTime}
            onChange={(e) => setEndTime(e.target.valueAsNumber)}
          />
        </div>
      </div>
    </div>
  )
}

export default BlurOptions
