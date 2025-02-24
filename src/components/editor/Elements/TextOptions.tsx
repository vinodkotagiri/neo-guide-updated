import { useEffect, useRef, useState } from 'react'
import { MdChevronLeft, MdDelete, MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addText, deleteBlur, deleteText, editText, setCurrentElement, TextElementState } from '../../../redux/features/elementsSlice'

import { setAddingElements } from '../../../redux/features/videoSlice'
import { CiTextAlignJustify } from 'react-icons/ci'
import { RiFontColor } from 'react-icons/ri'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const TextOptions = ({ playerRef }) => {
  const { currentElementId, texts, currentElement } = useAppSelector(state => state.elements)
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




  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
  }, [])


  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 15)
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
    if (currentElementId && currentElement == 'text') {
      dispatch(editText({ id: currentElementId, startTime: startTime, endTime: endTime, text, font, fontSize, fontColor, backgroundColor, justify }))
    }
  }, [startTime, endTime, currentElementId, text, font, fontColor, backgroundColor, justify, fontSize])




  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative'>

      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex   text-[#fff] text-[14px]'>

          Text
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewBlur} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />
          </button>

        </div>
      </div>
      <div className='border-b-[#303032] border-b flex flex-col gap-3 '>
        <div className='px-3 flex flex-col gap-3'>
          <div className='w-full'>
            <input className='input   bg-transparent border-[#303032] w-full  text-[#a3a3a5]  shadow-none ' value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className='flex w-full  gap-1'>

            <div className='w-10 h-10 flex items-center justify-center border-[1px] border-[#303032] cursor-pointer relative' onClick={() => setOpenTextDD(!openTextDD)}>
              <CiTextAlignJustify size={18} className='text-[#a3a3a5]' />
              {openTextDD && <><div className='  flex items-center justify-center border-[1px] border-[#303032] cursor-pointer absolute -bottom-11 left-0 bg-[#212025] gap-0  py-0'>
                <button className=' cursor-pointer inline-block p-2   hover:bg-[#000] rounded-md' onClick={() => setJustify('left')}>
                  <MdOutlineFormatAlignLeft size={20} className='text-[#a3a3a5]' />
                </button>
                <button className=' cursor-pointer inline-block p-2   hover:bg-[#000] rounded-md' onClick={() => setJustify('right')}>
                  <MdOutlineFormatAlignRight size={20} className='text-[#a3a3a5]' />
                </button>
                <button className=' cursor-pointer inline-block p-2   hover:bg-[#000] rounded-md' onClick={() => setJustify('center')}>
                  <MdOutlineFormatAlignCenter size={20} className='text-[#a3a3a5]' />
                </button>
                <button className=' cursor-pointer inline-block p-2   hover:bg-[#000] rounded-md' onClick={() => setJustify('justify')}>
                  <MdOutlineFormatAlignJustify size={20} className='text-[#a3a3a5]' />
                </button>
              </div>
              </>
              }
            </div>
            <select className="select select-bordered flex-1 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline:none focus:outline-none text-[#a3a3a5]" onChange={(e) => setFont(e.target.value)}>
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
            <select className="select select-bordered w-18 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline:none focus:outline-none text-[#a3a3a5]" defaultValue={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
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
            <div className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative" onClick={() => colorInputRef.current?.click()}>
              <RiFontColor size={18} className="z-10  text-[#a3a3a5]" />
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
        </div>

        {/* TIMES */}
        <div className='w-full flex  gap-2 p-3  justify-between  '>
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
            min={startTime + 5}
            max={duration}
            value={endTime}
            onChange={(e) => setEndTime(e.target.valueAsNumber)}
          /> */}
            <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(endTime).toFixed(2)}</span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteText({ id: currentElementId }))}> <FaRegTrashAlt /></label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextOptions
