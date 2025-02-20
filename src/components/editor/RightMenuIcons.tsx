import React from 'react'
import { RiSpeakAiLine } from "react-icons/ri";
import {PiShapesLight, PiSubtitles} from 'react-icons/pi'
import { useAppSelector } from '../../redux/hooks';
function RightMenuIcons({setRightActiveArea,rightActiveArea}) {
  return (
    <div className='h-full bg-slate-900 w-full text-slate-400 flex flex-col  align-items-center'>
     <MenuIconButton label='dub' icon={ <RiSpeakAiLine size={32}/>} setRightActiveArea={setRightActiveArea} val={1} rightActiveArea={rightActiveArea}/>
     <MenuIconButton label='subtitles' icon={ <PiSubtitles size={28}/>} setRightActiveArea={setRightActiveArea} val={2} rightActiveArea={rightActiveArea}/>
     <MenuIconButton label='elements' icon={ <PiShapesLight size={32}/>} setRightActiveArea={setRightActiveArea} val={3} rightActiveArea={rightActiveArea}/>
    </div>
  )
}

export default RightMenuIcons

function MenuIconButton({label, icon,setRightActiveArea,val,rightActiveArea }: { label:string,icon: React.ReactNode ,setRightActiveArea:any,val:number,rightActiveArea:number}) {
 const {locked}=useAppSelector(state=>state.video)
  return (
    <button  style={rightActiveArea==val?{backgroundColor:'#02BC7D',color:'#fff'}:{}} className='btn btn-ghost rounded-none outline-none shadow-none h-[64px] flex flex-col w-full justify-center items-center border-t-[1px] border-slate-600 p-2' onClick={()=>setRightActiveArea(val)}>
      {icon}
     <small>{label}</small> 
    </button>
  );
}