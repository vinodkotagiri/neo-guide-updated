//@ts-nocheck
import React, { useState } from 'react'
import RightMenuIcons from './RightMenuIcons'
import DubAreaComponent from './DubAreaComponent'
import SubtitleAreaComponent from './SubtitleAreaComponent'
import ElementsAddComponent from './ElementsAddComponent'

const EditorSider = () => {
  const [rightActiveArea,setRightActiveArea]=useState(1)
  return (
    <div className='w-full h-full bg-black-op rounded-md  flex z-50'>
      {/* <div>
      <EditorLeftTopBar setDub={setDub} />
      </div> */}  
      <div className='w-[calc(100%-64px)] text-slate-600 bg-slate-900 h-full border-[1px] border-slate-700'>
        {rightActiveArea==1 && <DubAreaComponent/>}
        {rightActiveArea==2&& <SubtitleAreaComponent/>}
        {rightActiveArea==3 && <ElementsAddComponent/>}
      </div>
      <div className='w-[64px] h-full'>
      <RightMenuIcons setRightActiveArea={setRightActiveArea} rightActiveArea={rightActiveArea}/>
      </div>
       
    </div>
  )
}

export default EditorSider