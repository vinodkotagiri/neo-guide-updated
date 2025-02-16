import React, { useEffect, useState } from 'react'
import { MdBlurOn, MdOutlineRectangle, MdOutlineTextFields,MdArrowOutward,MdOutlineCenterFocusStrong } from 'react-icons/md'
import {GoRepoPush} from 'react-icons/go'
import { useDispatch } from 'react-redux'
import { setAddingElements } from '../../redux/features/videoSlice'
import { addArrow, addBlur, addRectangle, addSpotLight, addText, ArrowElementState, BlurElementState, RectangleElementState, setCurrentElement, SpotElementElementState, TextElementState } from '../../redux/features/elementsSlice'
import { useAppSelector } from '../../redux/hooks'
import RectangleOptions from './Elements/RectangleOptions'
import BlurOptions from './Elements/BlurOptions'
import ArrowOptions from './Elements/ArrowOptions'
import TextOptions from './Elements/TextOptions'
import SpotlightOptions from './Elements/SpotlightOptions'
function ElementsAddComponent() {
  const {currentElement}=useAppSelector(state=>state.elements)
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(setAddingElements(true))
  },[])

  if(currentElement=='rectangle') return <RectangleOptions/>
  if(currentElement=='blur') return <BlurOptions/>
  if(currentElement=='arrow') return <ArrowOptions/>
  if(currentElement=='text') return <TextOptions/>
  if(currentElement=='spotlight') return <SpotlightOptions/>
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
        x:100,
        y:100,
        width:100,
        height:100,
        blurRadius:15,
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
        x:100,
        y:100,
        text:'Hello world',
        font:'Open Sans',
        fontSize:24,
        backgroundColor:'green',
        justify:'left',
        fontColor:'red',
        startTime:played,
        endTime:played+5
      }
      dispatch(addText(textData))
      dispatch(setCurrentElement('text'))
    }
    if(shape=='arrow'){
      dispatch(setAddingElements(true))
      const arrowData:ArrowElementState={
        id:Date.now().toString(),
        x:0,
        y:0,
        points:[50,50,50,50],
        strokeWidth:3,
        stroke:'red',
        pointerLenght:10,
        rotation:0,
        pointerWidth:10,
        startTime:played,
        endTime:played+5
      }
      dispatch(addArrow(arrowData))
      dispatch(setCurrentElement('arrow'))
    }
    if (shape === 'spotlight') {
      dispatch(setAddingElements(true));
    
      const spotlightData:SpotElementElementState = {
        id: Date.now().toString(),
        x: 100, 
        y: 100,
        width:100,
        height:100,
        glowColor: '#0ff',
        glowRadius:50,
        cornerRadius:[20,0,20,0],
        startTime: played,
        endTime: played + 5
      };
    
      dispatch(addSpotLight(spotlightData));
      dispatch(setCurrentElement('spotlight'));
    }
  }


  return (
  <button className='btn bg-[#02BC7D] text-slate-800 w-[160px]' onClick={()=>handleAddShape(label)}>{icon}<small className='capitalize'>{label}</small></button>
  )
}