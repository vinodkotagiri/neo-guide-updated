//@ts-nocheck
import { setIsArticle, setVideoName } from "../../redux/features/videoSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import logo from '../../assets/images/neo-logo.png'
import { IoIosMenu } from "react-icons/io";
import { PiExportBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { exportVideo, trackExportProgress } from "../../api/axios";


interface NavbarProps {
  from?: string,
  hideMenu?: string,
}

function Navbar({ from, hideMenu }: NavbarProps) {
  const { isArticle, videoName, videoHeight, videoWidth, url } = useAppSelector(state => state.video)
  const { articleData } = useAppSelector(state => state.article)
  const dispatch = useAppDispatch()
  const [token, setToken] = useState('')
  const [loading,setLoading]=useState(false)
  function handleVideoArticleSwitch() {
    dispatch(setIsArticle(!isArticle))
  }
  const { rectangles, arrows, texts, spotLights, blurs, zooms } = useAppSelector(state => state.elements)
  useEffect(() => {
    if (token) {
      trackProgress(token);
    }
  }, [token]);

  function handleExport() {
    setLoading(true)
    const payload = { video: url, videoWidth, videoHeight, rectangles, arrows, texts, spotLights, blurs, zooms }
    exportVideo(payload).then(token => {
      if(token){
        setToken(token)
        toast.success('Exporting video, token:')
      }else{
        setLoading(false)
        toast.error('Something went wrong while exporting video')
      }
    }).catch(()=>setLoading(false))

  }
  async function trackProgress(request_id) {
    if (request_id) {
      const interval = setInterval(() => {
        trackExportProgress(request_id).then((res) => {
          if (res?.status?.toLowerCase() === 'completed') {
            clearInterval(interval);
            setLoading(false)
            const data = res?.result?.subtitles;
            if (data?.error) {
              toast.error(data?.error);
              setLoading(false)
              return;
            }
          }
        });
      }, 5000);
      setToken('');
    }
  }

  return (
    <div className="navbar ">
      <div className="navbar-inside">
        <div className="px-4 flex  items-center justify-center gap-6">
          <a href="#"><img src={logo} alt="logo" className="w-6 shrink-0" /></a>
          {!hideMenu && <input type="text" onChange={(e) => dispatch(setVideoName(e.target.value))} value={videoName ?? "untitled project name"} className="text-[#a3a3a3] border-1 border-[#4b4b4b]   rounded-md px-2 py-1 w-[350px]" />
          }
          <button className="btn btn-ghost hover:bg-transparent text-white" onClick={handleExport} disabled={loading}>
            {loading?
            <span className="font-light"><span className="loading loading-dots loading-xl"></span>&emsp;Exporting</span>
            :<><PiExportBold size={32} color="white" />Export</>}
          </button>
        </div>

        <div className="flex gap-4 items-center ">
          {from == 'editor' && <div className="w-full items-center justify-center flex gap-2">
            <div className="nav-custom-btn">
              <button disabled={articleData?.length == 0} className={!isArticle ? "" : "active"} onClick={handleVideoArticleSwitch}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
                Guide</button>
              <button className={!isArticle ? "active" : ""} onClick={handleVideoArticleSwitch}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
                Video</button>
            </div>
          </div>}
          {!hideMenu &&
            <div className="drawer drawer-end ml-8">

              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label htmlFor="my-drawer" className="text-[#a3a3a3] text-3xl cursor-pointer   m-0  p-0"> <IoIosMenu /></label>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                  <li><a>Version History</a></li>
                  <li><a>Sidebar Item 2</a></li>
                </ul>
              </div>
            </div>
          }
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
    </div>
  )
}

export default Navbar