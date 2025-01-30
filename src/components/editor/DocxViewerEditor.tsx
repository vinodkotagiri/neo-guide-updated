import React, { useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import DocxViewer from './DocxViewer'

const DocxViewerEditor = ({fileUrl}:{fileUrl:string}) => {
  const [editing,setEditing]=useState(false)
  return (
    <div className='w-full h-full bg-black rounded-md relative'>
      <div  className='absolute top-1 left-1 tooltip tooltip-right' data-tip={editing?'Click to stop editing':'Click to start editing'}>
        <button className='text-slate-800 btn btn-lg bg-primary ' onClick={()=>setEditing(!editing)}>
         {editing? <FaEye size={24} />
          :<FaEdit size={24} />}
        </button>
      </div>
      <div className=' absolute  w-full h-[90%] top-[8%] p-2 '>
        <DocxViewer docxUrl={fileUrl}/>
      </div>
    </div>
  )
}

export default DocxViewerEditor