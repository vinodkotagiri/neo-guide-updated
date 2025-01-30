import { setIsArticle } from "../../redux/features/videoSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {MdOutlineVideoFile,MdOutlineArticle} from 'react-icons/md'
interface NavbarProps {
  from?: string
}

function Navbar({from}:NavbarProps) {
  const {isArticle}=useAppSelector(state=>state.video)
  const dispatch=useAppDispatch()
  function handleVideoArticleSwitch(){
    dispatch(setIsArticle(!isArticle))
  }
  return (
    <div className="navbar bg-neutral text-neutral-content">
  <div className="fixed px-4">
    <a className="btn btn-ghost text-xl">Neo Guide</a>
  </div>
 { from=='editor' &&<div className="w-full h-full  items-center justify-center flex gap-2">
  <button className="btn btn-lg w-[256px] text-xl  outline-none shadow-none border-slate-600 text-slate-400" style={isArticle?{background:'#00ff0040'}:{background:'#00000050'}} onClick={handleVideoArticleSwitch}><MdOutlineArticle size={32}/>Article</button>
  <button className="btn btn-lg w-[256px] text-xl outline-none shadow-none border-slate-600 text-slate-400" style={!isArticle?{background:'#00ff0040'}:{background:'#00000050'}} onClick={handleVideoArticleSwitch}><MdOutlineVideoFile size={32}/>Video</button>
  </div>}
  <div className="flex-none gap-2">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>

      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default Navbar