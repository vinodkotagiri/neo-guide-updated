import React, { useEffect, useState } from 'react'
import {BsTranslate} from 'react-icons/bs'
import { MdSettingsVoice } from "react-icons/md";
import {GrLanguage} from 'react-icons/gr'
import { getLanguages } from '../../helpers';

function EditorLeftTopBar() {
  const [operation,setOperation]=useState(1);
  const [lang,setLang]=useState(null)
  const [voice,setVoice]=useState(null)
  const [availableLanguages,setAvailableLanguages]=useState([])

  useEffect(()=>{
    const languageList=getLanguages();
    setAvailableLanguages(languageList);
  },[])
  
  return (
    <div className='w-full h-[72px] border-slate-700 border-b-[1px] flex items-center px-4 p-2 gap-2'>
      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <BsTranslate size={32} color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={1} onChange={(e)=>setOperation(parseInt(e.target.value) )}>
        <option value={1}>Translate & Dub</option>
        <option value={2}>Sub-titles</option>
      </select>
      </div>

      <div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <GrLanguage size={32 } color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={0} onChange={(e)=>setLang(e.target.value)}>
      <option value={null} disabled>Language</option>
        {availableLanguages.map((lang,index)=><option key={index} value={lang.value}>{lang.key}</option>)}
      </select>
      </div>

      {operation==1&&<div className='flex h-full items-center bg-slate-900 rounded-md px-2'>
      <MdSettingsVoice size={32 } color='#9810FA'/>
      <select className="text-white select select-sm outline-none cursor-pointer shadow-none border-none bg-slate-900  focus:ring-0 focus:outline-none" defaultValue={0} onChange={(e)=>setVoice(e.target.value)}>
      <option value={null} disabled>Voice</option>
        <option value={'Nitesh'}>Nitesh</option>
      </select>
      </div>}
    </div>
  )
}

export default EditorLeftTopBar