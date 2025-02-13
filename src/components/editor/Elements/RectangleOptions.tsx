import React, { useRef, useState } from 'react'
import { MdChevronLeft, MdDelete } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { deleteRectangle, setCurrentElement } from '../../../redux/features/elementsSlice'
import { IoMdColorPalette } from 'react-icons/io'

const RectangleOptions = () => {
  const { currentElementId } = useAppSelector(state => state.elements)
  const dispatch = useAppDispatch()
  const colorPickerRef = useRef<HTMLInputElement>(null)
  const [strokeColor,setStrokeColor]=useState('#fff')
  const [strokeWidth,setStrokeWidth]=useState(1)
  const handleColorPickerClick = () => {
    if (colorPickerRef.current) {
      console.log('clickkkk')
      colorPickerRef.current.click()
    }
  }

  return (
    <div className='w-full h-full py-4 px-2 flex flex-col gap-3'>
      <div className='flex items-center justify-between w-full h-6'>
        <div className='flex font-semibold text-slate-500'>
          <MdChevronLeft size={24} className='cursor-pointer' onClick={() => dispatch(setCurrentElement(null))} />
          <span>Rectangle</span>
        </div>
        <button className='cursor-pointer' onClick={() => dispatch(deleteRectangle({ id: currentElementId }))}>
          <MdDelete size={20} color='red' />
        </button>
      </div>

      <div className='w-full flex flex-col gap-2 p-3 bg-slate-700 rounded-md'>

        {/* STROKE COLOR */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Stroke Color</label>
          <button onClick={handleColorPickerClick} className="cursor-pointer">
            <IoMdColorPalette color={strokeColor} size={24} />
          </button>
          <input
            ref={colorPickerRef}
            type='color'
            className='hidden'
            onChange={e=>setStrokeColor(e.target.value)}
          />
        </div>
        {/* STROKE WIDTH */}
        <div className='flex items-center justify-between w-full'>
          <label className='text-slate-400 text-sm'>Stroke Width</label>
          <input
          className='w-1/2 accent-[#02bc7d] outline-none cursor-pointer'
            type='range'
          />
        </div>

      </div>
    </div>
  )
}

export default RectangleOptions
