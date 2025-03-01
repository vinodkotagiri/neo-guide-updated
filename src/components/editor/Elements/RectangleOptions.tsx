//@ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addRectangle, deleteRectangle, editRectangle, RectangleElementState, setCurrentElement, setCurrentElementId } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'
import { BsTransparency } from 'react-icons/bs'
import { setAddingElements } from '../../../redux/features/videoSlice'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const RectangleOptions = ({ playerRef }) => {
  const { currentElementId, rectangles, currentElement } = useAppSelector(state => state.elements)
  const { duration, currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const strokeColorRef = useRef<HTMLInputElement>(null)
  const fillColorRef = useRef<HTMLInputElement>(null)
  const [strokeColor, setStrokeColor] = useState('#fff')
  const [strokeWidth, setStrokeWidth] = useState(1)
  const [cornerRadius, setCornerRadius] = useState([1, 1, 1, 1])
  const [fillColor, setFillColor] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const handleSetTransparent = () => {
    setFillColor('transparent')
  }


  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
  }, [])

  function handleAddNewRectangle() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
    dispatch(setAddingElements(true))
    const rectData: RectangleElementState = {
      id: Date.now().toString(),
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      strokeColor: '#000',
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
        setStartTime(rectData.startTime)
        setEndTime(rectData.endTime)
      }
    }
  }, [currentElementId, rectangles])


  useEffect(() => {
    if (currentElementId && currentElement == 'rectangle') {
      dispatch(editRectangle({ id: currentElementId, strokeColor, strokeWidth, fillColor, cornerRadius, startTime, endTime }))
    }
  }, [strokeColor, strokeWidth, fillColor, cornerRadius, startTime, endTime])

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'rectangle' }))
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
          Rectangle
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewRectangle} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />
          </button>
        </div>
      </div>

      <div className='bg-[#303032]'style={rectangles.length ==0 ? {  } : {display: 'none' }}>
        WELCOMEEEE
      </div>
      <div className='border-b-[#303032] border-b' style={rectangles.length == 0 ? { display: 'none' } : {}}>
        <div className='w-full flex flex-col gap-2 p-3 pt-0    '>
          {/* STROKE COLOR */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Stroke Color</label>
            <input ref={strokeColorRef} onChange={e => setStrokeColor(e.target.value)} type="color" className=" h-6 w-6 border-none outline-0 cursor-pointer appearance-none" />
          </div>
          {/* STROKE WIDTH */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Stroke Width</label>
            <input
              className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm  '
              type='range'
              onChange={(e) => setStrokeWidth(e.target.valueAsNumber)}
              value={strokeWidth}
            />
          </div>
          {/* FILL COLOR */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Fill Color</label>
            <div className='flex gap-4 relative'>
              <input ref={fillColorRef} onChange={e => setFillColor(e.target.value)} type="color" className=" h-6 w-6 border-none outline-0    cursor-pointer     appearance-none" />
              <button onClick={handleSetTransparent} className="cursor-pointer tooltip" data-tip='Transparency'>
                <BsTransparency color={'#a3a3a5'} size={16} />
              </button>
            </div>

          </div>
          {/* BORDER RADIUS */}
          <div className='flex items-center justify-between w-full'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Border Radius</label>
            <input
              className='w-1/2  h-[3px]     outline-none      rounded-lg   cursor-pointer range-sm'
              type='range'
              min={0}
              max={50}
              value={cornerRadius[0]}
              onChange={(e) => setCornerRadius([e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber, e.target.valueAsNumber])}
            />
          </div>
        </div>
        {/* TIMES */}

        {rectangles.map(rectangle => (<div className='w-full flex  gap-2 p-3  justify-between  cursor-pointer hover:bg-[#212025]'
          key={rectangle.id}
          style={activeId == rectangle.id ? { backgroundColor: '#212025' } : {}}
          onClick={() => handleClick(rectangle)}>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(rectangle.startTime).toFixed(2)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(rectangle.endTime).toFixed(2)}</span>

          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteRectangle({ id: rectangle.id }))}> <FaRegTrashAlt /></label>
          </div>
        </div>))}
      </div>

    </div>
  )
}

export default RectangleOptions
