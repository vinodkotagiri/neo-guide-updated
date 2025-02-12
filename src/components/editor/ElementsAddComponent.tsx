import React, { useEffect } from 'react'
import { MdBlurOn, MdOutlineRectangle, MdOutlineTextFields,MdArrowOutward,MdOutlineCenterFocusStrong } from 'react-icons/md'
import {GoRepoPush} from 'react-icons/go'
import { useDispatch } from 'react-redux'
import { setAddingElements } from '../../redux/features/videoSlice'
function ElementsAddComponent() {
  const disptch=useDispatch()
  useEffect(()=>{
    disptch(setAddingElements(true))
  },[])
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full border-b-[1px] h-10 border-slate-600 flex items-center justify-between px-2'>
        Add Elements
      </div>
      <div className='flex flex-wrap justify-center items-center py-4 px-1 gap-4'>
        <ElementTypeComponent icon={<MdBlurOn size={32}/>} label={'blur'}/>
        <ElementTypeComponent icon={<MdOutlineRectangle size={32}/>} label={'rectangle'}/>
        <ElementTypeComponent icon={<MdOutlineTextFields size={32}/>} label={'text'}/>
        <ElementTypeComponent icon={<MdArrowOutward size={32}/>} label={'arrow'}/>
        <ElementTypeComponent icon={<MdOutlineCenterFocusStrong size={32}/>} label={'spotlight'}/>
        <ElementTypeComponent icon={<GoRepoPush size={32}/>} label={'pop-over'}/>
      
      </div>
    </div>
  )
}

export default ElementsAddComponent

function ElementTypeComponent({icon,label}) {
  return (
  <button className='btn bg-[#02BC7D] text-slate-800 w-[160px]'>{icon}<small className='capitalize'>{label}</small></button>
  )
}