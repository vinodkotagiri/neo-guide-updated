// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { BsTranslate } from 'react-icons/bs'
import { MdSettingsVoice } from "react-icons/md";
import { GrLanguage } from 'react-icons/gr'
import { languagesWithVoice } from '../../constants';
import toast from 'react-hot-toast';
import { getProgress, getSubtitles, translateAndDub } from '../../api/axios';
import { useAppSelector } from '../../redux/hooks';
import { setLoaderData } from '../../redux/features/loaderSlice';
import { useDispatch } from 'react-redux';
import { setVideoUrl } from '../../redux/features/videoSlice';
import { PiMagicWand } from "react-icons/pi";
import ArticleMenu from './ArticleMenu';
import { TbBrandTypescript } from "react-icons/tb";
import { IoLanguage } from "react-icons/io5";
import { TbReplace } from "react-icons/tb";

function EditorLeftTopBar({ setDub }) {
  const dispatch = useDispatch()
  const [operation, setOperation] = useState(1);
  const [lang, setLang] = useState(null)
  const [voice, setVoice] = useState(null)
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [availableVoices, setAvailableVoices] = useState([])
  const [requestId, setRequestId] = useState('')
  const { url } = useAppSelector(state => state.video)
  useEffect(() => {
    const languageList = [...languagesWithVoice]
    setAvailableLanguages(languageList);
  }, [])

  useEffect(() => {
    setLang(availableLanguages[0]?.language)
  }, [availableLanguages])

  useEffect(() => {
    if (lang) {
      const voices = availableLanguages.find((item) => item.language === lang)?.voices
      setAvailableVoices(voices)
    }
  }, [lang, availableLanguages])


  async function handleTranslataAndDub() {
    if (operation == 1) {
      if (lang && voice) {
        const response = await translateAndDub({ target_language: lang, voice: voice, s3_link: url })
        if (response?.request_id) {
          // dispatch(setLoader({loading:true}))
          setDub(true)
          const progessInterval = setInterval(() => {
            getProgress(response?.request_id).then(res => {
              if (res?.status?.toLowerCase() == 'completed') {
                clearInterval(progessInterval)
                dispatch(setVideoUrl(res?.result?.dubbed_video_url));
                setDub(false)
              } else if (res?.status?.toLowerCase().includes('error')) {
                clearInterval(progessInterval)
                setDub(false)
                toast.error(JSON.stringify(res?.status?.toLowerCase()));
              }

              else {
                dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
              }
            })
          }, 5000)
        } else {
          setDub(false)
          toast.error('Error dubbing/translating video');
        }
      } else if (!lang) {
        return toast.error('Please select a language')
      } else if (!voice) {
        return toast.error('Please select a voice')
      }
    }

    if (operation == 2) {
      if (lang) {
        const response = await getSubtitles({ target_language: lang, video_path: url })
        if (response?.request_id) {
          // dispatch(setLoader({loading:true}))
          setDub(true)
          const progessInterval = setInterval(() => {
            getProgress(response?.request_id).then(res => {
              if (res?.status?.toLowerCase() == 'completed') {
                clearInterval(progessInterval)
                const data = res?.result;
                const s3Url = data.split(': ')[1]
                dispatch(setVideoUrl(s3Url))
                console.log('data:::', data)
                // dispatch(setArticleData(data))
                setDub(false)
              } else if (res?.status?.toLowerCase().includes('error')) {
                clearInterval(progessInterval)
                setDub(false)
                toast.error(JSON.stringify(res?.status?.toLowerCase()));
              }

              else {
                dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
              }
            })
          }, 5000)
        } else {
          setDub(false)
          toast.error('Error dubbing/translating video');
        }
      } else if (!lang) {
        return toast.error('Please select a language')
      } else if (!voice) {
        return toast.error('Please select a voice')
      }
    }

  }


  return (
    <>
      <div className="flex p-2">

        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-4" className="ai-menu-btn mt-1  bg-color-dark"><IoLanguage />
              Transcript</label>
          </div>
          <div className="drawer-side z-50" >
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <div className='w-full  px-4 p-2 gap-2  '>
                <div className='flex   items-center bg-slate-900 rounded-md px-2'>
                  <BsTranslate size={32} color='#9810FA' />
                  <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={1} value={operation} onChange={(e) => setOperation(parseInt(e.target.value))}>
                    <option value={1}>Translate & Dub</option>
                    <option value={2}>Sub-titles</option>
                  </select>
                </div>

                <div className='flex  items-center bg-slate-900 rounded-md px-2'>
                  <GrLanguage size={32} color='#9810FA' />
                  <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'languages'} onChange={(e) => setLang(e.target.value)}>
                    <option value={'languages'} disabled>Language</option>
                    {availableLanguages.map((lang, index) => <option key={index} value={lang.language}>{lang.language}</option>)}
                  </select>
                </div>

                {operation == 1 && <div className='flex   items-center bg-slate-900 rounded-md px-2'>
                  <MdSettingsVoice size={32} color='#9810FA' />
                  <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'voices'} onChange={(e) => {
                    console.log('e.target.value', e.target.value)
                    setVoice(e.target.value)
                  }}>
                    <option value={'voices'} disabled>Voice</option>
                    {availableVoices.map((voice, index) => <option key={index} value={voice}>{voice}</option>)}
                  </select>
                </div>}
                <button className='  text-white shadow-none border-none  btn bg-black  p-0 ' onClick={handleTranslataAndDub}>GO</button>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer drawer-end">
          <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-5" className="ai-menu-btn  mt-1  bg-color-dark"><TbReplace />
              Find & Replcace</label>
          </div>
          <div className="drawer-side z-50">
            <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
            </ul>
          </div>
        </div>
        <ArticleMenu languageIcon={false} />
      </div>
      {/* <div className='w-full h-[72px]   flex items-center px-4 p-2 gap-2  '>
        <div className='flex   items-center bg-slate-900 rounded-md px-2'>
          <BsTranslate size={32} color='#9810FA' />
          <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={1} value={operation} onChange={(e) => setOperation(parseInt(e.target.value))}>
            <option value={1}>Translate & Dub</option>
            <option value={2}>Sub-titles</option>
          </select>
        </div>

        <div className='flex  items-center bg-slate-900 rounded-md px-2'>
          <GrLanguage size={32} color='#9810FA' />
          <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'languages'} onChange={(e) => setLang(e.target.value)}>
            <option value={'languages'} disabled>Language</option>
            {availableLanguages.map((lang, index) => <option key={index} value={lang.language}>{lang.language}</option>)}
          </select>
        </div>

        {operation == 1 && <div className='flex   items-center bg-slate-900 rounded-md px-2'>
          <MdSettingsVoice size={32} color='#9810FA' />
          <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'voices'} onChange={(e) => {
            console.log('e.target.value', e.target.value)
            setVoice(e.target.value)
          }}>
            <option value={'voices'} disabled>Voice</option>
            {availableVoices.map((voice, index) => <option key={index} value={voice}>{voice}</option>)}
          </select>
        </div>}
        <button className='  text-white shadow-none border-none   p-0 ' onClick={handleTranslataAndDub}>GO</button>
      </div> */}
    </>
  )
}

export default EditorLeftTopBar