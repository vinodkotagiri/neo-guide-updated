import { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete, MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addText, deleteBlur, deleteText, editText, setCurrentElement, TextElementState } from '../../../redux/features/elementsSlice'

import { setAddingElements } from '../../../redux/features/videoSlice'
import { CiTextAlignJustify } from 'react-icons/ci'
import { RiFontColor } from 'react-icons/ri'

const TextOptions = () => {
  const { currentElementId, texts } = useAppSelector(state => state.elements)
  const { duration, currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [text, setText] = useState('');
  const [font, setFont] = useState('Open Sans');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [justify, setJustify] = useState('left');
  const [openTextDD, setOpenTextDD] = useState(false);

  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

useEffect(()=>{
  setStartTime(currentPlayTime)
  setEndTime(currentPlayTime+15)
},[])


  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime+15)
    dispatch(setAddingElements(true))
    const textData: TextElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      text: text,
      font: font,
      fontSize: fontSize,
      fontColor: fontColor,
      backgroundColor: backgroundColor,
      justify: justify,
      startTime: startTime,
      endTime: endTime
    }
    dispatch(addText(textData))
    dispatch(setCurrentElement('text'))
  }


  useEffect(() => {
    const currentRect = texts.find(rect => rect.id === currentElementId)
    if (currentRect) {
      setStartTime(currentRect.startTime)
      setEndTime(currentRect.endTime)
      setFont(currentRect.font)
      setFontSize(currentRect.fontSize)
      setText(currentRect.text)
      setFontColor(currentRect.fontColor)
      setBackgroundColor(currentRect.backgroundColor)
      setJustify(currentRect.justify)
    }
  }, [texts, currentElementId])

  useEffect(() => {
    if (currentElementId) {
      dispatch(editText({ id: currentElementId, startTime: startTime, endTime: endTime, text, font, fontSize, fontColor, backgroundColor, justify }))
    }
  }, [startTime, endTime, currentElementId, text, font, fontColor, backgroundColor, justify, fontSize])




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
          <span>Text</span>
        </div>
        <button onClick={handleAddNewBlur} className='btn btn-success btn-xs outline-none border-none shadow-none'>
          New
        </button>
        <button className='cursor-pointer' onClick={() => dispatch(deleteText({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button>
      </div>

      <div>
        <input className='input input-bordered bg-transparent border-slate-100 w-full max-w-xs' value={text} onChange={(e) => setText(e.target.value)}/>
      </div>
      <div className='flex w-full px-1 gap-1'>

        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer relative' onClick={() => setOpenTextDD(!openTextDD)}>
          <CiTextAlignJustify size={18} />
          {openTextDD && <><div className='h-12 flex items-center justify-center border-[1px] border-slate-600 cursor-pointer absolute -bottom-14 left-1 bg-slate-900 gap-3 px-3'>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => setJustify('left')}>
              <MdOutlineFormatAlignLeft size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => setJustify('right')}>
              <MdOutlineFormatAlignRight size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => setJustify('center')}>
              <MdOutlineFormatAlignCenter size={20} />
            </button>
            <button className='btn btn-ghost hover:bg-[#02bc7d]' onClick={() => setJustify('justify')}>
              <MdOutlineFormatAlignJustify size={20} />
            </button>
          </div>
          </>
          }
        </div>
        <select className="select select-bordered flex-1 bg-transparent shadow-none border-[1px] border-slate-800 cursor-pointer outline:none focus:outline-none" onChange={(e) => setFont(e.target.value)}>
          <option value={'Open Sans'}>Open Sans</option>
          <option value={'Alegreya'}>Alegreya</option>
          <option value={'Arial'}>Arial</option>
          <option value={'Roboto'}>Roboto</option>
          <option value={'Anek Latin'}>Anek Latin</option>
          <option value={'Montserrat'}>Montserrat</option>
          <option value={'Poppins'}>Poppins</option>
          <option value={'Oswald'}>Oswald</option>
          <option value={'Raleway'}>Raleway</option>
        </select>
        <select className="select select-bordered w-18 bg-transparent shadow-none border-[1px] border-slate-800 cursor-pointer outline:none focus:outline-none" defaultValue={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
          <option value='38'>46</option>
          <option value='38'>44</option>
          <option value='38'>42</option>
          <option value='38'>40</option>
          <option value='38'>38</option>
          <option value='36'>36</option>
          <option value='32'>32</option>
          <option value='30'>30</option>
          <option value='28'>28</option>
          <option value='26'>26</option>
          <option value='24'>24</option>
          <option value='22'>22</option>
          <option value='20'>20</option>
          <option value='18'>18</option>
          <option value='16'>16</option>
          <option value='14'>14</option>
          <option value='12'>12</option>
          <option value='10'>10</option>
          <option value='8'>8</option>
        </select>
        <div className="w-10 h-10 flex items-center justify-center border border-slate-800 cursor-pointer relative" onClick={() => colorInputRef.current?.click()}>
          <RiFontColor size={18} className="z-10" />
          <input
            type="color"
            ref={colorInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>
        {/* <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer relative' onClick={() => bgInputRef.current?.click()}>
          <BiColorFill size={18} className='z-10' />
          <input
            type="color"
            ref={bgInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div> */}
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

export default TextOptions
