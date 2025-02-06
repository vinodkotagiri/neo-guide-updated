import React from 'react'
import { RiSpeakAiLine } from "react-icons/ri";
import {PiSubtitles} from 'react-icons/pi'
function RightMenuIcons() {
  return (
    <div className='h-full bg-slate-900 w-full text-slate-400 flex flex-col  align-items-center'>
     <MenuIconButton icon={ <RiSpeakAiLine size={32}/>}/>
     <MenuIconButton icon={ <PiSubtitles size={32}/>}/>
    </div>
  )
}

export default RightMenuIcons

function MenuIconButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className='btn btn-ghost rounded-none outline-none shadow-none h-[64px] flex w-full justify-center items-center border-t-[1px] border-slate-600 p-2'>
      {icon}
    </button>
  );
}