//@ts-nocheck
import React, { useEffect, useState } from 'react'
import EditorLeftTopBar from './EditorLeftTopBar'
import { useAppSelector } from '../../redux/hooks'
import LocalLoader from '../global/LocalLoader'

const EditorSider = () => {
  const { articleData } = useAppSelector(state => state.article)
  const { percentage, status } = useAppSelector(state => state.loader)
  const [dub, setDub] = useState(false)
  return (
    <div className='w-full h-full   bg-black-op rounded-md  '>
      <EditorLeftTopBar setDub={setDub} />
      {articleData.length == 0 || dub == true ? <div className='w-full h-full overflow-auto relative '>
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
        </div>}
    </div>
  )
}

export default EditorSider