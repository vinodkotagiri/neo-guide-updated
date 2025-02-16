import React, { useEffect, useRef, useState } from 'react'
import { TfiDownload } from "react-icons/tfi";
import { CiTextAlignJustify } from "react-icons/ci";
import { RiFontColor } from "react-icons/ri";
import { BiColorFill } from "react-icons/bi";
import { setLocked, updateRetries, updateSubtitleBackground, updateSubtitleColor, updateSubtitleData, updateSubtitleFont, updateSubtitleFontSize, updateSubtitleTextJustify } from '../../redux/features/videoSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md';
import { languages } from '../../constants';
import { getProgress, getSubtitles } from '../../api/axios';
import toast from 'react-hot-toast';
import { setLoaderData } from '../../redux/features/loaderSlice';
function SubtitleHeader() {
  const dispatch = useAppDispatch()
  const [reqId, setReqId] = useState('')
  const { subtitles, url } = useAppSelector(state => state.video)
  const [selectedLanguage, setSelectedLanguage] = useState({})
  const [languageList, setLanguageList] = useState([])
  const colorInputRef = useRef(null);
  const bgInputRef = useRef(null)
  const [openTextDD, setOpenTextDD] = React.useState(false)
  function handleLanguageChange(e) {
    // setSelectedLanguage(languages[e.target.value])
    getSubtitles({ target_language: e.target.value, video_path: url }).then((res) => {
      const request_id = res?.request_id;
      if (request_id) {
        setReqId(request_id);
        toast.success('Video uploaded successfully');
      } else {
        // toast.error('Forbidden');
      }
    })
      .catch(() => {
        toast.error('Error uploading video');
        dispatch(setLocked(false))
      })
      .finally(() => {
        dispatch(setLocked(false))
      });
  }
  useEffect(() => {
    setSelectedLanguage(languages[0])
    setLanguageList(languages.map(lang => Object.keys(lang)[0]))
  }, [languages])

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
    getSubtitles({ target_language: e.target.value, video_path: url }).then((res) => {
      const request_id = res?.request_id;
      if (request_id) {
        setReqId(request_id);
        toast.success('Video uploaded successfully');
      } else {
        // toast.error('Forbidden');
      }
    })
      .catch(() => {
        toast.error('Error uploading video');
        dispatch(setLocked(false))
      })
      .finally(() => {
        dispatch(setLocked(false))
      });
  }

  useEffect(() => {
    if (reqId) {
      getArticleData(reqId)
    }
  }, [reqId])

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLocked(true))
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            const data = res?.result?.subtitles;
            if (data?.error) {
              dispatch(setLocked(false))
              dispatch(updateSubtitleData([]))
              dispatch(updateRetries())
              setReqId('')
              return toast.error(data?.error)
            }
            dispatch(updateSubtitleData(data))
            dispatch(setLocked(false))
          } else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    }
  }



  return (
    <div className='w-full border-b-[1px] h-12   border-slate-600 flex items-center justify-between '>
      <div className='w-content h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer'>
        <div className='flex btn bg-transparent  shadow-none outline-none border-none w-content text-blue-400'>
          <div><span className='text-xl'>{Object.values(selectedLanguage)[0]?.flag}</span></div>
          <select className=' bg-transparent w-[180px] text-xs hovr:outline-none h-full outline-none border-none  text-slate-500  cursor-pointer' onChange={handleLanguageChange}>
            {languageList.map((item, index) => <option key={index} value={index} className='block' >{item}</option>)}
          </select>
        </div>
      </div>
      <div className='flex w-full px-1 gap-1'>
        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer'>
          <TfiDownload size={18} />
        </div>

        <div className='w-10 h-10 flex items-center justify-center border-[1px] border-slate-800 cursor-pointer relative' onClick={() => setOpenTextDD(!openTextDD)}>
          <CiTextAlignJustify size={18} />
          {openTextDD && <><div className='h-12 flex items-center justify-center border-[1px] border-slate-600 cursor-pointer absolute -bottom-14 left-1 bg-slate-900 gap-3 px-3'>
            <button className=' btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => dispatch(updateSubtitleTextJustify('left'))}>
              <MdOutlineFormatAlignLeft size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => dispatch(updateSubtitleTextJustify('right'))}>
              <MdOutlineFormatAlignRight size={20} />
            </button>
            <button className='btn btn-ghost  hover:bg-[#02bc7d]' onClick={() => dispatch(updateSubtitleTextJustify('center'))}>
              <MdOutlineFormatAlignCenter size={20} />
            </button>
            <button className='btn btn-ghost hover:bg-[#02bc7d]' onClick={() => dispatch(updateSubtitleTextJustify('justify'))}>
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