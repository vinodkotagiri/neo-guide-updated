// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addText, deleteText, editText, setCurrentElement, setCurrentElementId, TextElementState } from '../../../redux/features/elementsSlice'

import { setAddingElements } from '../../../redux/features/videoSlice'
import { CiTextAlignJustify } from 'react-icons/ci'
import { RiFontColor } from 'react-icons/ri'
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import { TbBackground } from 'react-icons/tb'

const TextOptions = ({ playerRef }) => {
  const { currentElementId, texts, currentElement } = useAppSelector(state => state.elements)
  const { currentPlayTime } = useAppSelector(state => state.video)
  const dispatch = useAppDispatch()
  const [text, setText] = useState('');
  const [font, setFont] = useState('Open Sans');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [justify, setJustify] = useState('center');
  const [rotation, setRotation] = useState(0);
  // const [openTextDD, setOpenTextDD] = useState(false);

  const colorInputRef = useRef(null);
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [activeId, setActiveId] = useState(null)

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'text' }))
    playerRef?.current?.seekTo(item.startTime)
    setActiveId(item.id)
  }

  useEffect(() => {
    setActiveId(currentElementId)
    const currentRect = texts.find(rect => rect.id === currentElementId)
    if (currentRect) {
      setFontSize(currentRect.fontSize)
    }
  }, [currentElementId])




  useEffect(() => {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
  }, [])


  function handleAddNewBlur() {
    setStartTime(currentPlayTime)
    setEndTime(currentPlayTime + 5)
    dispatch(setAddingElements(true))
    dispatch(setCurrentElementId({ id: null, type: null }))
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
  }, [currentElementId])

  useEffect(() => {
    if (currentElementId && currentElement == 'text') {
      dispatch(editText({ id: currentElementId, startTime: startTime, endTime: endTime, text, font, fontSize, fontColor, backgroundColor, justify, rotation }))
    }
  }, [startTime, endTime, text, font, fontColor, backgroundColor, rotation, justify, fontSize, currentElement, dispatch])


  const textSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 54, 60, 66, 72
  ];

  return (
    <div className='w-full  pb-4 pt-2 px-2 flex flex-col gap-3 relative'>

      <div className='border-b-[#303032] border-b flex items-center pb-2 justify-between'>
        <div className='flex   text-[#ffffff] text-[14px]'>

          Text
        </div>
        <div className='flex items-center gap-4' >
          <button onClick={handleAddNewBlur} className=' text-[#d9d9d9] cursor-pointer  text-[14px]'>
            <FaPlus />
          </button>

        </div>
      </div>

      <div className='w-full flex' style={texts.length == 0 ? {} : { display: 'none' }}>
        <button className='cursor-pointer bg-[#422ad5]  rounded-lg text-white mx-auto px-3 py-2 mt-4 flex items-center gap-2' onClick={handleAddNewBlur} ><FaPlus /> Add New Text</button>
      </div>
      <div className='border-b-[#303032] border-b flex flex-col gap-3 ' style={texts.length == 0 ? { display: 'none' } : {}}>
        <div className='px-3 flex flex-col gap-3'>
          <div className='w-full'
            style={{ backgroundColor: backgroundColor, fontFamily: font, textAlign: justify }}
          >
            <input className='input bg-transparent border-[#303032] w-full shadow-none ' value={text}
              style={{ color: fontColor }}
              onChange={(e) => setText(e.target.value)} />
          </div>
          <div className='flex w-full  gap-1'>
            <select className="select select-bordered flex-1 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline:none focus:outline-none text-[#a3a3a5]" value={font} onChange={(e) => setFont(e.target.value)}>
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
            <select className="select select-bordered w-18 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline:none focus:outline-none text-[#a3a3a5]" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
              {textSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}

            </select>
            <div className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative" onClick={() => colorInputRef.current?.click()}
              style={{ backgroundColor: fontColor }}
              >
              <RiFontColor size={18} className="z-10  text-[#a3a3a5]" />
              <input
                type="color"
                ref={colorInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={fontColor}
                style={{ backgroundColor: fontColor }}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </div>
            <div className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative" onClick={() => colorInputRef.current?.click()}
              style={{ backgroundColor: backgroundColor }}
              >
              <TbBackground size={18} className="z-10  text-[#a3a3a5]" />
              <input
                type="color"
                ref={colorInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={fontColor}
                style={{ backgroundColor: backgroundColor }}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>

          </div>
          <div className='flex items-center gap-3'>
            <input className='range range-neutral cursor-pointer' type='range' min={-360} max={360} step={1} value={rotation} onChange={(e) => setRotation(e.target.value)} />
            <input
              type='number'
              className='h-6 w-18 pl-2 border-1 rounded-md cursor-pointer' placeholder='360' min={-360} max={360}
              step={1}
              onChange={(e) => setRotation(e.target.value)}
              value={rotation} />
          </div>
        </div>

        {/* TIMES */}
        {texts.map((text) => (
          <div className='w-full flex  gap-2 p-3  justify-between cursor-pointer hover:bg-[#212025]'
            style={activeId == text.id ? { backgroundColor: '#212025' } : {}}
            key={text.id}
            onClick={() => handleClick(text)}
          >
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>Start Time</label>

              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(text.startTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#a3a3a5] text-sm text-nowrap'>End Time</label>

              <span className='w-1/2  outline-none   border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center'>{Number(text.endTime).toFixed(2)}</span>
            </div>
            <div className='flex items-center gap-3'>
              <label className='text-[#ffa6bf] cursor-pointer' onClick={() => dispatch(deleteText({ id: currentElementId }))}> <FaRegTrashAlt /></label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TextOptions
