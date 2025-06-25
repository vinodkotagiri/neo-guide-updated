import React from 'react'
import { RiSpeakAiLine } from "react-icons/ri";
import { MdArrowOutward, MdBlurOn, MdFindReplace, MdOutlineCenterFocusStrong, MdOutlineRectangle, MdOutlineTextFields, MdSubtitles, MdZoomOutMap } from 'react-icons/md';

function RightMenuIcons({ setRightActiveArea, rightActiveArea }) {
  return (
    <div className='h-full   w-full text-slate-400 flex flex-col  align-items-center'>
      {/* <MenuIconButton label='Dub' icon={<RiSpeakAiLine size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={1} rightActiveArea={rightActiveArea} /> */}
      <MenuIconButton label='Subtitle' icon={<MdSubtitles size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={2} rightActiveArea={rightActiveArea} />
      {/* <MenuIconButton label='Find & Replace' icon={<MdFindReplace size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={9} rightActiveArea={rightActiveArea} /> */}
      <MenuIconButton label='Blur' icon={<MdBlurOn size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={4} rightActiveArea={rightActiveArea} />
      <MenuIconButton label='Rectangle' icon={<MdOutlineRectangle size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={5} rightActiveArea={rightActiveArea} />
      <MenuIconButton label='Text' icon={<MdOutlineTextFields size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={6} rightActiveArea={rightActiveArea} />
      <MenuIconButton label='Arrow' icon={<MdArrowOutward size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={7} rightActiveArea={rightActiveArea} />
      <MenuIconButton label='Spotlight' icon={<MdOutlineCenterFocusStrong size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={8} rightActiveArea={rightActiveArea} />
      <MenuIconButton label='Zoom' icon={<MdZoomOutMap size={24} className='shrink-0' />} setRightActiveArea={setRightActiveArea} val={9} rightActiveArea={rightActiveArea} />

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