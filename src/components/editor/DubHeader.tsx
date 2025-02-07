import React, { useEffect, useState } from 'react'
import { languages } from '../../constants'
import { IoIosMic } from "react-icons/io";

function DubHeader() {
  const [selectedLanguage,setSelectedLanguage]=useState({})
  const [selectedVoice,setSelectedVoice]=useState({})
  const [languageList,setLanguageList]=useState([])
  useEffect(()=>{
    setSelectedLanguage(languages[0])
    setLanguageList(languages.map(lang=>Object.keys(lang)[0]))
  },[languages])
  
  useEffect(()=>{
    if(Object.keys(selectedLanguage).length){
      const voices=Object.values(selectedLanguage)[0]?.voices
      setSelectedVoice(voices[0])
    }
  },[selectedLanguage])
function handleLanguageChange(e){
  setSelectedLanguage(languages[e.target.value])
}
function handleVoiceChange(e){
  setSelectedVoice(e.target.value)
}
console.log('selectedVOice',selectedVoice)

  return (
    <div className='w-full border-b-[1px] border-slate-600 flex items-center justify-between px-2'>
      <div className='flex items-center justify-center gap-2'> 
        {/* <div className='dropdown'>
          <details>
          <summary className="btn m-1 bg-transparent  shadow-none outline-none border-none w-content text-blue-400"><span className='mr-2 text-xl'><span className='text-slate-500 text-xs'>{Object.keys(selectedLanguage)[0]}</span></summary>
          <ul className="menu dropdown-content bg-base-100 flex flex-col rounded-box z-[1] w-48 overflow-x-scroll h-[180px] p-2 shadow">
            {languageList.map((item,index)=><li key={index} className='block'>{item}</li>)}
          </ul>
          </details>  
        </div> */}
        <div className='flex btn bg-transparent  shadow-none outline-none border-none w-content text-blue-400'>
          <div><span className='text-xl'>{Object.values(selectedLanguage)[0]?.flag}</span></div>
        <select className=' bg-transparent w-[180px] text-xs hovr:outline-none h-full outline-none border-none  text-slate-500  cursor-pointer' onChange={handleLanguageChange} value={selectedVoice.voice}>
        {languageList.map((item,index)=><option key={index} value={index} className='block' >{item}</option>)}
        </select>
        </div>

      </div>
      {/* <div className="dropdown ">
        <details>
          <summary className="btn m-1 bg-transparent  shadow-none outline-none border-none w-content text-blue-400"><span><IoIosMic size={24}/></span><span className=' text-xs'>{selectedVoice.voice}</span></summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow ">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
      </div> */}
      <div className='flex gap-1 items-center justify-center text-xs font-semibold text-blue-500'>
     <IoIosMic size={24}/>
       <select className='bg-transparent   h-full outline-none border-none cursor-pointer' onChange={handleVoiceChange}>
       {Object.values(selectedLanguage)[0]?.voices.map(item=>(<option key={item.value} value={item}>{item.voice}</option>))}
        </select>
        </div>
    </div>
  )
}

export default DubHeader