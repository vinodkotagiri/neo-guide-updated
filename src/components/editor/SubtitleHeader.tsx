import React, { useRef } from 'react'
import { TfiDownload } from "react-icons/tfi";
import { CiTextAlignJustify } from "react-icons/ci";
import { RiFontColor } from "react-icons/ri";
import { BiColorFill } from "react-icons/bi";
import { updateSubtitleBackground, updateSubtitleColor, updateSubtitleFont, updateSubtitleFontSize, updateSubtitleTextJustify } from '../../redux/features/videoSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md';
function SubtitleHeader() {
  const dispatch = useAppDispatch()
  const { subtitles } = useAppSelector(state => state.video)
  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null)
  const [openTextDD, setOpenTextDD] = React.useState(false)
  function handleFontChange(event) {
    const selectedFont = event.target.value;
    dispatch(updateSubtitleFont(selectedFont))
  }
  function handleFontSize(event) {
    const selectedFontSize = parseInt(event.target.value);
    dispatch(updateSubtitleFontSize(selectedFontSize))
  }

  function handleTextColorChange(e) {
    dispatch(updateSubtitleColor(e.target.value))
  }
  function handleTextBgChange(e) {
    dispatch(updateSubtitleBackground(e.target.value))
  }

  return (
    <div className='w-full border-b-[1px] h-12   border-slate-600 flex items-center justify-between '>
      <div className='flex w-full px-1 gap-1'>
        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer'>
          <TfiDownload size={18} />
        </div>

        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer relative' onClick={() => setOpenTextDD(!openTextDD)}>
          <CiTextAlignJustify size={18} />
          {openTextDD && <><div className='h-12 flex items-center justify-center border-[1px] border-slate-600 cursor-pointer absolute -bottom-14 left-1 bg-slate-900 gap-3 px-3'>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={()=>dispatch(updateSubtitleTextJustify('left'))}>
              <MdOutlineFormatAlignLeft size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={()=>dispatch(updateSubtitleTextJustify('right'))}>
              <MdOutlineFormatAlignRight size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={()=>dispatch(updateSubtitleTextJustify('center'))}>
              <MdOutlineFormatAlignCenter size={20} />
            </button>
            <button className='btn btn-ghost hover:bg-[#02bc7d]' onClick={()=>dispatch(updateSubtitleTextJustify('justify'))}>
              <MdOutlineFormatAlignJustify size={20} />
            </button>
          </div>
          </>
          }
        </div>
        <select className="select select-bordered flex-1 bg-transparent shadow-none border-[1px] border-slate-800 cursor-pointer outline:none focus:outline-none" onChange={handleFontChange}>
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
        <select className="select select-bordered w-18 bg-transparent shadow-none border-[1px] border-slate-800 cursor-pointer outline:none focus:outline-none" defaultValue={subtitles.fontSize} onChange={handleFontSize}>
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
            onChange={handleTextColorChange}
          />
        </div>
        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer relative' onClick={() => bgInputRef.current?.click()}>
          <BiColorFill size={18} className='z-10' />
          <input
            type="color"
            ref={bgInputRef}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleTextBgChange}
          />
        </div>
      </div>
    </div>
  )
}

export default SubtitleHeader