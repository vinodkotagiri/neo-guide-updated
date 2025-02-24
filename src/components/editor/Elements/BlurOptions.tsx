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
  const [selectedBlurId, setSelectedBlurId] = useState('')

  const [activeStyle, setActiveStyle] = useState({});

  useEffect(() => {
    if (currentElementId === selectedBlurId) {
      setActiveStyle({ background: "#212025" })
    } else {
      setActiveStyle({})
    }
  }, [currentElementId, selectedBlurId])

  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
  }, [])

  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
    dispatch(setAddingElements(true))
    const blurData: BlurElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      blurRadius: blurRadius,
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addBlur(blurData))
    dispatch(setCurrentElement('blur'))
  }


  useEffect(() => {
    const currentRect = blurs.find(rect => rect.id === currentElementId)
    console.log('currentRect')
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



  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative '>
      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>



        <div className='flex   text-[#fff] text-[14px]'>

          Blur
        </div>

        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewBlur} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />

          </button>
          {/* <button className=' text-[#ffa6bf] cursor-pointer  text-[14px]' onClick={() => dispatch(deleteBlur({ id: currentElementId }))}>
            <FaRegTrashAlt />
          </button> */}
        </div>

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
      <div className='flex flex-col justify-between'>

        {blurs.map((blur, index) => (
          <div className='w-full flex  gap-2 p-3  justify-between border-b border-b-[#303032] ' style={currentElementId === blur.id ? activeStyle : {}} onClick={() => {
            dispatch(setCurrentElement('blur'))
            playerRef?.current?.seekTo(blur.startTime)
            setCurrentElementId(blur.id)
            setSelectedBlurId(blur.id)
          }}>
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
