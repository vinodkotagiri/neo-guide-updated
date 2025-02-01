//@ts-nocheck
import React, { useEffect, useState } from 'react'
import EditorLeftTopBar from './EditorLeftTopBar'
import { useAppSelector } from '../../redux/hooks'
import LocalLoader from '../global/LocalLoader'

const EditorSider = () => {
  const { articleData } = useAppSelector(state => state.article)
  return (
    <div className='w-full h-full border-l-[1px] border-slate-700'>
      <EditorLeftTopBar />
     { articleData.length==0?<div className='w-full h-full overflow-auto relative'>
     <LocalLoader loading={true}/>
     </div>
     :
      <div className='w-full h-full overflow-auto p-4'>
        {articleData.map((item: { text: string, image_url: string }, index: number) =>
          <>
            {item.image_url && <img src={item.image_url} alt='img' />}

            {
              item.text && <div key={index} className='w-full h-auto border-[1px] border-slate-700 rounded-md p-2 my-2'>{item.text}</div>
            }
          </>
        )}
      </div>}
    </div>
  )
}

export default EditorSider