import React from 'react'
import { MdArrowOutward, MdBlurOn, MdOutlineCenterFocusStrong, MdOutlineRectangle, MdOutlineTextFields, MdZoomOutMap } from 'react-icons/md';
import { useAppSelector } from '../../redux/hooks';
import { PiSubtitles } from 'react-icons/pi';

function RightMenuIcons({ setRightActiveArea, rightActiveArea }) {
  const { isDisabled } = useAppSelector(state => state.video)
  return (
    <div className='h-full w-full text-slate-400 flex flex-col  align-items-center'>

      {isDisabled ? <>
        <div className=' h-[64px] w-[64px] flex items-center justify-center border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
        <div className=' h-[64px] w-[64px] flex items-center justify-center  border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
        <div className=' h-[64px] w-[64px] flex items-center justify-center border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
        <div className=' h-[64px] w-[64px] flex items-center justify-center border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
        <div className=' h-[64px] w-[64px] flex items-center justify-center border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
        <div className=' h-[64px] w-[64px] flex items-center justify-center border-b border-slate-400'>
          <div className='loading text-primary' />
        </div>
      </>
        : <>
          <MenuIconButton label='Subtitles' icon={<PiSubtitles size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={2} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Blur' icon={<MdBlurOn size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={4} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Rectangle' icon={<MdOutlineRectangle size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={5} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Text' icon={<MdOutlineTextFields size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={6} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Arrow' icon={<MdArrowOutward size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={7} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Spotlight' icon={<MdOutlineCenterFocusStrong size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={8} rightActiveArea={rightActiveArea} />
          <MenuIconButton label='Zoom' icon={<MdZoomOutMap size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={9} rightActiveArea={rightActiveArea} />
        </>}
    </div>
  )
}

export default RightMenuIcons

function MenuIconButton({ label, icon, setRightActiveArea, val, rightActiveArea }: { label: string, icon: React.ReactNode, setRightActiveArea: any, val: number, rightActiveArea: number }) {
  return (
    <button className={`side_menu ${rightActiveArea === val ? 'sidemenu_active' : ''}`}
      onClick={() => setRightActiveArea(val)}>
      {icon}
      <small>{label}</small>
    </button>
  );
}