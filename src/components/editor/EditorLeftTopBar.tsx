import React, { useEffect, useState } from 'react'
import {BsTranslate} from 'react-icons/bs'
import { MdSettingsVoice } from "react-icons/md";
import {GrLanguage} from 'react-icons/gr'
import { languagesWithVoice } from '../../constants';
import toast from 'react-hot-toast';
import { translateAndDub } from '../../api/axios';
import { useAppSelector } from '../../redux/hooks';

function EditorLeftTopBar() {
  const [operation,setOperation]=useState(1);
  const [lang,setLang]=useState(null)
  const [voice,setVoice]=useState(null)
  const [availableLanguages,setAvailableLanguages]=useState([])
  const [availableVoices,setAvailableVoices]=useState([])
  const {url}=useAppSelector(state=>state.video)
  useEffect(()=>{
    const languageList=[...languagesWithVoice]
    setAvailableLanguages(languageList);
  },[])

  useEffect(()=>{
    setLang(availableLanguages[0]?.language)
  },[availableLanguages])

  useEffect(()=>{
    if(lang){
      const voices=availableLanguages.find((item)=>item.language===lang)?.voices
      setAvailableVoices(voices)
    }
  },[lang,availableLanguages])




  function handleTranslataAndDub(){
    if(operation==1){
      if(lang && voice){
        console.log('translate and dub')
      }else if(!lang){
        toast.error('Please select a language')
      }else if(!voice){
        toast.error('Please select a voice')
      }
    }
    translateAndDub({target_language:lang,voice:voice,s3_link:url}).then((res)=>{
      console.log(res)
    })
  }


  return (
    <div className='w-full h-[72px] border-slate-700 border-b-[1px] flex items-center px-4 p-2 gap-2'>
      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <BsTranslate size={32} color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={1} value={operation} onChange={(e)=>setOperation(parseInt(e.target.value) )}>
        <option value={1}>Translate & Dub</option>
        <option value={2}>Sub-titles</option>
      </select>
      </div>

      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <GrLanguage size={32 } color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'languages'}  onChange={(e)=>setLang(e.target.value)}>
      <option value={'languages'} disabled>Language</option>
        {availableLanguages.map((lang,index)=><option key={index} value={lang.language}>{lang.language}</option>)}
      </select>
      </div>

      {operation==1&&<div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <MdSettingsVoice size={32 } color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={'voices'}  onChange={(e)=>{
        console.log('e.target.value',e.target.value)
        setVoice(e.target.value)
      }}>
      <option value={'voices'} disabled>Voice</option>
        {availableVoices.map((voice,index)=><option key={index} value={voice}>{voice}</option>)}
      </select>
      </div>}
      <button className='btn text-white shadow-none border-none btn-lg bg-slate-900 ' onClick={handleTranslataAndDub}>GO</button>
    </div>
  )
}

export default EditorLeftTopBar