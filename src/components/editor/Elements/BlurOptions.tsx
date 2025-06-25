//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addBlur, addRectangle, BlurElementState, deleteBlur, deleteRectangle, editBlur, editRectangle, RectangleElementState, setCurrentElement, setCurrentElementId } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const BlurOptions = ({ playerRef }) => {
  const { currentElementId, blurs, currentElement } = useAppSelector(state => state.elements)
  const { duration, currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [blurRadius, setBlurRadius] = useState(50);
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [activeId, setActiveID] = useState(null)

  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
  }, [])

  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
    dispatch(setAddingElements(true))
    const blurData: BlurElementState = {
      id: Date.now().toString(),
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      blurRadius: blurRadius,
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addBlur(blurData))
    dispatch(setCurrentElement({ id: blurData.id, type: 'blur' }))
  }


  useEffect(() => {
    const currentRect = blurs.find(rect => rect.id === currentElementId)
    if (currentRect) {
      setStartTime(currentRect.startTime)
      setEndTime(currentRect.endTime)
    }
  }, [blurs, currentElementId])

  useEffect(() => {
    if (currentElementId && currentElement == 'blur') {
      dispatch(editBlur({ id: currentElementId, startTime: startTime, endTime: endTime }))
    }
  }, [startTime, endTime])

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'blur' }))
    playerRef?.current?.seekTo(item.startTime)
    setActiveID(item.id)
  }

  useEffect(() => {
    setActiveID(currentElementId)
  }, [currentElementId])

  return (
    <div className='w-full  pb-4 pt-3 px-3 flex flex-col gap-3 relative '>
      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex text-[#ffffff] text-[18px]'>
          Blur
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewBlur} className=' text-[#d9d9d9] cursor-pointer  text-[15px] flex items-center flex-row gap-2 add_new_btn'>
            <FaPlus /> Add New
          </button>
        </div>

      </div>
      <div className=' w-full flex' style={blurs.length == 0 ? {} : { display: 'none' }}>
        <button className='cursor-pointer bg-[#422ad5]  rounded-lg text-white mx-auto px-3 py-2 mt-4 flex items-center gap-2 add_btn_bg' onClick={handleAddNewBlur} ><FaPlus /> Add New Blur</button>
      </div>

      {/* TIMES */}
      <div className='flex flex-col justify-between'>

        {blurs.map((blur, index) => (
          <div className='w-full flex  gap-2 p-3  justify-between border-b border-b-[#303032] cursor-pointer hover:bg-[#212025]'
            key={blur.id}
            style={activeId == blur.id ? { backgroundColor: '#212025' } : {}}
            onClick={() => handleClick(blur)}
          >
            <div className='flex items-center gap-3  '>
              <div className='flex items-center gap-3 '>
                <label className='text-[#a3a3a5] text-sm text-nowrap'>{index + 1}</label>
              </div>
              <div className='flex items-center gap-3'>
                <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>

                <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(blur.startTime).toFixed(2)}</span>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(blur.endTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteBlur({ id: blur.id }))}> <FaRegTrashAlt /></label>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default BlurOptions
