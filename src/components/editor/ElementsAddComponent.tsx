import React, { useEffect, useState } from 'react'
import { MdBlurOn, MdOutlineRectangle, MdOutlineTextFields,MdArrowOutward,MdOutlineCenterFocusStrong } from 'react-icons/md'
import {GoRepoPush} from 'react-icons/go'
import { useDispatch } from 'react-redux'
import { setAddingElements } from '../../redux/features/videoSlice'
import { addBlur, addRectangle, addText, BlurElementState, RectangleElementState, setCurrentElement, TextElementState } from '../../redux/features/elementsSlice'
import { useAppSelector } from '../../redux/hooks'
import RectangleOptions from './Elements/RectangleOptions'
import BlurOptions from './Elements/BlurOptions'
function ElementsAddComponent() {
  const {currentElement}=useAppSelector(state=>state.elements)
  const dispatch=useDispatch()

  // useEffect(()=>{
  //   dispatch(setAddingElements(true))
  // },[])

  if(currentElement=='rectangle') return <RectangleOptions/>
  if(currentElement=='blur') return <BlurOptions/>
  if(currentElement==null)
  return (
    <>
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
    </>
  )
}

export default ElementsAddComponent

function ElementTypeComponent({icon,label}) {
  const {played}=useAppSelector(state=>state.video)
  const dispatch=useDispatch()
  function handleAddShape(shape:string) {
    console.log('shape',shape)
    if(shape=='rectangle') {
      dispatch(setAddingElements(true))
      const rectData:RectangleElementState={
        id:Date.now().toString(),
        x:0,
        y:0,
        width:100,
        height:100,
        strokeColor:'#fff',
        strokeWidth:3,
        cornerRadius:[1,1,1,1],
        fillColor:'transparent',
        startTime:played,
        endTime:played+5
      }
      dispatch(addRectangle(rectData))
      dispatch(setCurrentElement('rectangle'))
    }
    if(shape=='blur'){
      dispatch(setAddingElements(true))
      const blurData:BlurElementState={
        id:Date.now().toString(),
        x:0,
        y:0,
        width:100,
        height:100,
        blurRadius:5,
        startTime:played,
        endTime:played+5
      }
      dispatch(addBlur(blurData))
      dispatch(setCurrentElement('blur'))
    }
    if(shape=='text'){
      dispatch(setAddingElements(true))
      const textData:TextElementState={
        id:Date.now().toString(),
        x:0,
        y:0,
        text:'Hello world',
        font:'Open Sans',
        fontSize:12,
        backgroundColor:'green',
        justify:'left',
        fontColor:'red',
        startTime:played,
        endTime:played+5
      }
      dispatch(addText(textData))
      dispatch(setCurrentElement('text'))
    }
  }


  return (
  <button className='btn bg-[#02BC7D] text-slate-800 w-[160px]' onClick={()=>handleAddShape(label)}>{icon}<small className='capitalize'>{label}</small></button>
  )
}