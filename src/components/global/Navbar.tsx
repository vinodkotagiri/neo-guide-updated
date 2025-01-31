import { setIsArticle } from "../../redux/features/videoSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { PiArticleThin,PiVideoThin } from "react-icons/pi";
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
    <div className="navbar bg-gradient-to-tl from-slate-900 via-slate-900 to-blue-900 text-neutral-content">
  <div className="fixed px-4">
    <a className="btn btn-ghost text-xl">Neo Guide</a>
  </div>
 { from=='editor' &&<div className="w-full h-full  items-center justify-center flex gap-2">
  <button className="flex items-center w-[128px]  border-b-4 outline-none shadow-none  text-slate-400 cursor-pointer" style={isArticle?{borderColor:'#9810FA',fontWeight:600}:{borderColor:'transparent'}} onClick={handleVideoArticleSwitch}><PiArticleThin size={32}/>&emsp;Article</button>
  <button className="flex items-center w-[128px]  border-b-4 outline-none shadow-none  text-slate-400 cursor-pointer" style={!isArticle?{borderColor:'#9810FA',fontWeight:600}:{borderColor:'transparent'}} onClick={handleVideoArticleSwitch}><PiVideoThin size={32}/>&emsp;Video</button>
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