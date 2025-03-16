//@ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addZoom, deleteZoom, editZoom, setCurrentElement, setCurrentElementId, ZoomElementState } from '../../../redux/features/elementsSlice'
import { setAddingElements, setCurrentPlayTime } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const ZoomOptions = ({ playerRef }) => {
  const { currentElementId, zooms, currentElement } = useAppSelector(state => state.elements)
  const { currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()

  const [zoomFactor, setZoomFactor] = useState(0)
  const [easingFactor, setEasingFactor] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [activeId, setActiveId] = useState(null)


  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
  }, [])

  function handleAddNewZoom() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
    dispatch(setAddingElements(true))
    const zoomData: ZoomElementState = {
      id: Date.now().toString(),
      zoom_factor: zoomFactor,
      easing_factor: easingFactor,
      start_time: currentPlayTime,
      end_time: currentPlayTime + 5,
      roi: { x: 100, y: 100, width: 100, height: 100 }
    }
    dispatch(addZoom(zoomData))
    dispatch(setCurrentElement('zoom'))
  }


  useEffect(() => {
    if (currentElementId) {
      const zoomData = zooms.find(rect => rect.id === currentElementId)
      if (zoomData) {
        setZoomFactor(zoomData.zoom_factor)
        setEasingFactor(zoomData.easing_factor)
        setStartTime(zoomData.startTime)
        setEndTime(zoomData.endTime)
      }
      if (zoomData) {
        setZoomFactor(zoomData.zoom_factor)
        setEasingFactor(zoomData.easing_factor)
        setStartTime(zoomData.startTime)
        setEndTime(zoomData.endTime)
      }
    }
  }, [currentElementId, zooms])


  useEffect(() => {
    if (currentElementId && currentElement == 'zooms') {
      dispatch(editZoom({ id: currentElementId, zoom_factor: zoomFactor, easing_factor: easingFactor, start_time: startTime, end_time: endTime }))
    }
  }, [zoomFactor, easingFactor, startTime, endTime])

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'zoom' }))
    playerRef?.current?.seekTo(item.startTime)
    setActiveId(item.id)
  }

  useEffect(() => {
    setActiveId(currentElementId)
  }, [currentElementId])



  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative '>
      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex   text-[#fff] text-[14px]'>
          Zoom
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewZoom} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />
          </button>
        </div>
      </div>

      <div className='w-full flex' style={zooms.length == 0 ? {} : { display: 'none' }}>

        <button className='cursor-pointer bg-[#422ad5]  rounded-lg text-white mx-auto px-3 py-2 mt-4 flex items-center gap-2' onClick={handleAddNewZoom}><FaPlus /> Add New Zoom</button>

      </div>

      <div className='border-b-[#303032] border-b' style={zooms.length == 0 ? { display: 'none' } : {}}>
        <div className='flex items-center gap-3 p-3'>
          <label className='text-[#a3a3a5] text-sm'>Zoom Factor</label>
          <input type='number' value={zoomFactor} onChange={(e) => setZoomFactor(e.target.value)} className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1' />
        </div>
        <div className='flex items-center gap-3 p-3'>
          <label className='text-[#a3a3a5] text-sm'>Easing Factor</label>
          <input type='number' value={easingFactor} onChange={(e) => setEasingFactor(e.target.value)} className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1' />
        </div>
        {/* TIMES */}

        {zooms.map(rectangle => (<div className='w-full flex  gap-2 p-3  justify-between  cursor-pointer hover:bg-[#212025]'
          key={rectangle.id}
          style={activeId == rectangle.id ? { backgroundColor: '#212025' } : {}}
          onClick={() => handleClick(rectangle)}>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(rectangle.start_time).toFixed(2)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(rectangle.end_time).toFixed(2)}</span>

          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteZoom({ id: rectangle.id }))}> <FaRegTrashAlt /></label>
          </div>
        </div>))}
      </div>

    </div>
  )
}

export default ZoomOptions
