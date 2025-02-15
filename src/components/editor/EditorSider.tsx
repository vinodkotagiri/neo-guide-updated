//@ts-nocheck
import React, { useEffect, useState } from 'react'
import EditorLeftTopBar from './EditorLeftTopBar'
import { useAppSelector } from '../../redux/hooks'
import LocalLoader from '../global/LocalLoader'
import RightMenuIcons from './RightMenuIcons'
import DubHeader from './DubHeader'
import DubAreaComponent from './DubAreaComponent'
import SubtitleAreaComponent from './SubtitleAreaComponent'
import ElementsAddComponent from './ElementsAddComponent'

const EditorSider = () => {
  const { articleData } = useAppSelector(state => state.article)
  const { percentage, status } = useAppSelector(state => state.loader)
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
      {/* {articleData.length == 0 || dub == true ? <div className='w-full h-full overflow-auto relative '>
        <LocalLoader loading={true} progress={percentage} text={status} />
      </div>
        :
        <div className='w-full h-full overflow-auto p-4 pt-0 scrollbar'>
          {articleData.map((item: { text: string, image_url: string }, index: number) =>
            <>
              {item.image_url && <img src={item.image_url} alt='img' />}

              {
                item.text && <div key={index} className='w-full h-auto   p-2 my-1 text-white'>{item.text}</div>
              }
            </>
          )}
        </div>} */}
    </div>
  )
}

export default EditorSider