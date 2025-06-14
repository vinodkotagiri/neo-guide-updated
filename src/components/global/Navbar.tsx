//@ts-nocheck
import { setIsArticle, setReferenceId, setVideoName } from "../../redux/features/videoSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import logo from '../../assets/images/neo-logo.png'
import { IoMdCloudDone, IoMdCloudUpload } from "react-icons/io";
import { PiExportBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { exportOrupdateJSON, exportOrupdateProject, exportVideo, getVersions, trackExportProgress } from "../../api/axios";
import { MdContentCopy, MdHistory, MdOutlineArticle } from "react-icons/md";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { CiExport, CiLogout, CiUser } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin6Line, RiFileVideoLine } from "react-icons/ri";
import { BsFiletypeGif } from "react-icons/bs";
import { convertToIST } from "../../helpers";
interface NavbarProps {
  from?: string,
  hideMenu?: string,
}




function Navbar({ from, hideMenu }: NavbarProps) {
  const { isArticle, videoName, videoHeight, videoWidth, url, user_id, subtitles, sourceLang, sourceLangName, targetLang, targetLangName, voice, voice_language, voiceid } = useAppSelector(state => state.video)
  const { articleData } = useAppSelector(state => state.article)
  const dispatch = useAppDispatch()
  const [token, setToken] = useState('')
  const [uniqueId, setUniqueId] = useState('')
  const [subtitleId, setSubtitleId] = useState('')
  const [articleId, setArticleId] = useState('')
  const [refId, setRefId] = useState('')
  function handleVideoArticleSwitch() {
    dispatch(setIsArticle(!isArticle))
  }
  const [versions,setVersions]=useState<{id:string|number, tstamp:string}>([])
  const { rectangles, arrows, texts, spotLights, blurs, zooms } = useAppSelector(state => state.elements)
  useEffect(() => {
    if (token) {
      trackProgress(token);
    }
  }, [token]);
  const [open, setOpen] = useState<string | null>("Docs");
  function handleExport() {
    setLoading(true)
    const payload = {
      video: url,
      videoWidth,
      videoHeight,
      rectangles: rectangles.map(rect => ({
        ...rect,
        width: ((rect.width / videoWidth) * 100).toFixed(2),
        height: ((rect.height / videoHeight) * 100).toFixed(2),
        x: ((rect.x / videoWidth) * 100).toFixed(2),
        y: ((rect.y / videoHeight) * 100).toFixed(2),
        cornerRadius: rect.cornerRadius.map(radius => ((radius / videoWidth) * 100).toFixed(2))
      })),
      arrows: arrows.map(arrow => ({
        ...arrow,
        strokeWidth: ((arrow.strokeWidth / videoWidth) * 100).toFixed(2),
        pointerLength: ((arrow.pointerLength / videoWidth) * 100).toFixed(2),
        pointerWidth: ((arrow.pointerWidth / videoWidth) * 100).toFixed(2),
        x: ((arrow.x / videoWidth) * 100).toFixed(2),
        y: ((arrow.y / videoHeight) * 100).toFixed(2),
        points: arrow.points.map(point => ((point / videoWidth) * 100).toFixed(2))
      }))
      , texts: texts.map(text => ({
        ...text,
        x: ((text.x / videoWidth) * 100).toFixed(2),
        y: ((text.y / videoHeight) * 100).toFixed(2),
      })),
      spotLights: spotLights.map(spot => ({
        ...spot,
        x: ((spot.x / videoWidth) * 100).toFixed(2),
        y: ((spot.y / videoHeight) * 100).toFixed(2),
        width: ((spot.width / videoWidth) * 100).toFixed(2),
        height: ((spot.height / videoHeight) * 100).toFixed(2),
        cornerRadius: spot.cornerRadius.map(radius => ((radius / videoWidth) * 100).toFixed(2))
      })),
      blurs: blurs.map(blur => ({
        ...blur,
        x: ((blur.x / videoWidth) * 100).toFixed(2),
        y: ((blur.y / videoHeight) * 100).toFixed(2),
        width: ((blur.width / videoWidth) * 100).toFixed(2),
        height: ((blur.height / videoHeight) * 100).toFixed(2),
        blurRadius: ((blur.blurRadius / videoWidth) * 100).toFixed(2)
      }
      )),
      zooms: zooms.map(zoom => (
        {
          ...zoom,
          roi: {
            x: ((zoom.roi.x / videoWidth) * 100).toFixed(2),
            y: ((zoom.roi.y / videoHeight) * 100).toFixed(2),
            width: ((zoom.roi.width / videoWidth) * 100).toFixed(2),
            height: ((zoom.roi.height / videoHeight) * 100).toFixed(2)
          }
        }))
    }

    exportVideo(payload).then(token => {
      if (token) {
        setToken(token)
        toast.success('Exporting video, token:')
      } else {
        setLoading(false)
        toast.error('Something went wrong while exporting video')
      }
    }).catch(() => setLoading(false))
  }

  async function trackProgress(request_id) {
    if (request_id) {
      const interval = setInterval(() => {
        trackExportProgress(request_id).then(async(res) => {
          if (res?.progress == 100) {
            clearInterval(interval);
            setLoading(false)
            const data = res?.video_url;
            await downloadVideo(data);
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

  const downloadVideo = (videoURL: string, fileName: string = "exportted_video.mp4") => {
    fetch(videoURL)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error("Error downloading videoURL:", error));
  };

  const saveVideo = async () => {
    if (!uniqueId) {
      setUniqueId(Date.now().toString())
    }
    const video = url ? url.split('/').pop() : ''
    const subtitlePayload = subtitles.data
    const articlePayload = articleData
    if (subtitlePayload?.length && articlePayload?.length) {
     await exportOrupdateJSON({ json: subtitlePayload, action: subtitleId ? "update" : "insert", filename: `${uniqueId}-subtitle.json` }).then(res => {
        console.log("res",res)
        if (res.file_url) {
          setSubtitleId(res.file_url.split('/').pop())
        }
      }).catch(err => console.log(err))
      await exportOrupdateJSON({ json: articlePayload, action: articleId ? "update" : "insert", filename: `${uniqueId}-article.json` }).then(res => {
        if (res.file_url) setArticleId(res.file_url.split('/').pop())
      }).catch(err => console.log(err))
    const payload = {
      unique_id: uniqueId,
      user_id: user_id,
      projectname: videoName,
      tstamp: Date.now().toString(),
      video: video,
      subtitle: subtitleId,
      article: articleId,
      sourceLang,
      sourceLangName,
      targetLang,
      targetLangName,
      voice,
      voice_language,
      voiceid,
      data : {
        video: url,
        videoWidth,
        videoHeight,
        rectangles: rectangles.map(rect => ({
          ...rect,
          width: ((rect.width / videoWidth) * 100).toFixed(2),
          height: ((rect.height / videoHeight) * 100).toFixed(2),
          x: ((rect.x / videoWidth) * 100).toFixed(2),
          y: ((rect.y / videoHeight) * 100).toFixed(2),
          cornerRadius: rect.cornerRadius.map(radius => ((radius / videoWidth) * 100).toFixed(2))
        })),
        arrows: arrows.map(arrow => ({
          ...arrow,
          strokeWidth: ((arrow.strokeWidth / videoWidth) * 100).toFixed(2),
          pointerLength: ((arrow.pointerLength / videoWidth) * 100).toFixed(2),
          pointerWidth: ((arrow.pointerWidth / videoWidth) * 100).toFixed(2),
          x: ((arrow.x / videoWidth) * 100).toFixed(2),
          y: ((arrow.y / videoHeight) * 100).toFixed(2),
          points: arrow.points.map(point => ((point / videoWidth) * 100).toFixed(2))
        }))
        , texts: texts.map(text => ({
          ...text,
          x: ((text.x / videoWidth) * 100).toFixed(2),
          y: ((text.y / videoHeight) * 100).toFixed(2),
        })),
        spotLights: spotLights.map(spot => ({
          ...spot,
          x: ((spot.x / videoWidth) * 100).toFixed(2),
          y: ((spot.y / videoHeight) * 100).toFixed(2),
          width: ((spot.width / videoWidth) * 100).toFixed(2),
          height: ((spot.height / videoHeight) * 100).toFixed(2),
          cornerRadius: spot.cornerRadius.map(radius => ((radius / videoWidth) * 100).toFixed(2))
        })),
        blurs: blurs.map(blur => ({
          ...blur,
          x: ((blur.x / videoWidth) * 100).toFixed(2),
          y: ((blur.y / videoHeight) * 100).toFixed(2),
          width: ((blur.width / videoWidth) * 100).toFixed(2),
          height: ((blur.height / videoHeight) * 100).toFixed(2),
          blurRadius: ((blur.blurRadius / videoWidth) * 100).toFixed(2)
        }
        )),
        zooms: zooms.map(zoom => (
          {
            ...zoom,
            roi: {
              x: ((zoom.roi.x / videoWidth) * 100).toFixed(2),
              y: ((zoom.roi.y / videoHeight) * 100).toFixed(2),
              width: ((zoom.roi.width / videoWidth) * 100).toFixed(2),
              height: ((zoom.roi.height / videoHeight) * 100).toFixed(2)
            }
          }))
      }
    }
    if (refId) payload['reference_id'] = refId
    setSavingStatus(true)
    console.log('articleId && subtitleId && video',articleId, subtitleId , video)
      exportOrupdateProject(payload).then(res => {
        setRefId(res.reference_id)
      }).catch(err => console.log(err)).finally(() => setSavingStatus(false))
    }

  }

  useEffect(()=>{
    dispatch(setReferenceId(refId))
    getVersions(refId).then((result) => {
      if(result?.versions){
        setVersions(result.versions)
      }
    }).catch((err) => {
      console.log('err',err)
      setVersions([])
    });
  },[refId])





  return (
    <div className="navbar ">
      <div className="navbar-inside">
        <div className="px-4 flex  items-center justify-center gap-6">
          <a href="#"><img src={logo} alt="logo" className="w-6 shrink-0" /></a>
          {!hideMenu && <input type="text" onChange={(e) => dispatch(setVideoName(e.target.value))} value={videoName ?? "untitled project name"} className="text-[#a3a3a3] border-1 border-[#4b4b4b]   rounded-md px-2 py-1 w-[350px]" />
          }
          {/* {url && <button className="btn btn-ghost hover:bg-transparent text-white" onClick={handleExport} disabled={loading}>
            {loading ?
              <span className="font-light"><span className="loading loading-dots loading-xl"></span>&emsp;Exporting</span>
              : <><PiExportBold size={32} color="white" />Export</>}
          </button>} */}
          {/* {url && savingStatus == true && <span className="flex items-center gap-2 text-slate-600 animate-pulse"><IoMdCloudUpload size={18} color="gray" />saving...</span>}
          {url && savingStatus == false && <span className="flex items-center gap-2 text-green-800 "><IoMdCloudDone size={18} color="green" />saved</span>} */}
        </div >

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


          <div   >
            <div className="w-10 "   >
              <label htmlFor="my-drawer">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  className="cursor-pointer rounded-full "
                />
              </label>
            </div>



          </div>
          {!hideMenu &&
            <div className="drawer drawer-end">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />

              <div className="drawer-side z-50">

                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="min-h-full bg-[#16151a] menu  p-4 w-75">
                  <h6 className="text-md text-white ">Welcome</h6>
                  <h3 className="text-2xl text-white border-b-[1px] border-[#303032] pb-4">Suman Chepuri</h3>
                  <aside className="text-white    mt-4">
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="flex items-center gap-2 py-1">
                          <CiUser />
                          <span>Profile</span>
                        </a>
                      </li>
                      <li>
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setOpen(open === "Version History" ? null : "Version History")}
                        >
                          <div className="flex items-center gap-2">
                            <MdHistory />
                            <span>Version History</span>
                          </div>
                          <IoChevronDown className={`${open === "Version History" ? 'rotate-180' : ''} transition-transform`} />
                        </div>
                        {open === "Version History" && (
                          <ul className="m-0 p-0  text-sm ">
                            {versions?versions.map((version, index) => (  
                            <li onClick={() => document.getElementById('my_modal_3')?.showModal()}>
                              <MdHistory />
                              <span>Version {`${index+1} - ${convertToIST(version.tstamp)}`}</span>
                            </li>
                            )):<li>No Saved Versions</li>}
                          </ul>
                        )}
                      </li>
                      <li>
                        <a href="#"  >
                          <MdContentCopy />
                          <span>Make a copy</span>
                        </a>
                      </li>
                      {/* Docs */}
                      <li>
                        <div
                          className="flex items-center justify-between cursor-pointer "
                          onClick={() => setOpen(open === "Docs" ? null : "Docs")}
                        >
                          <div className="flex items-center gap-2">
                            <CiExport />
                            <span>Export</span>
                          </div>
                          <IoChevronDown className={`${open === "Docs" ? 'rotate-180' : ''} transition-transform`} />
                        </div>
                        {open === "Docs" && (
                          <ul className="ml-4 mt-1 space-y-1 text-sm text-gray-300">
                            <li onClick={handleExport} className="cursor-pointer"><RiFileVideoLine />  Video </li>
                            <li><MdOutlineArticle />  Article</li>
                            <li><BsFiletypeGif /> Gif</li>

                          </ul>
                        )}
                      </li>
                      <li onClick={saveVideo}>
                        <a  >
                          <FaRegSave />
                          <span>Save</span>
                        </a>
                      </li>
                      <li>
                        <a href="#"  >
                          <RiDeleteBin6Line />
                          <span>Delete Project</span>
                        </a>
                      </li>
                      <li>
                        <a href="#"  >
                          <CiLogout />
                          <span>Logout</span>
                        </a>
                      </li>
                    </ul>
                  </aside>

                </div>
              </div>
            </div>
          }
          <dialog id="my_modal_3" className="modal change_modal">
            <div className="modal-box p-[30px] bg-[#16151a]   rounded-2xl">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <div className="w-full flex justify-between border-b pb-4 border-b-[#303032]">
                  <h4 className='text-xl font-semibold text-[#ffffff]  '>Are you sure Restore History</h4>
                  <button className="  cursor-pointer  w-[25px] h-[25px] flex justify-center items-center rounded-full text-[#ffffff]  text-xl"><IoClose /></button>
                </div>


                <p className="py-4 text-white">12:49 PM on May 17, 2025</p>
                <div className="flex gap-2 items-center justify-end">


                  <button className=" cursor-pointer text-[#777] p-3 font-semibold text-[14px] rounded-md  " >Cancel</button>
                  <button className="bg-[#422ad5] cursor-pointer text-[#ffffff] p-3 font-semibold text-[14px] rounded-md" >Restore Version</button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div >
    </div >
  )
}

export default Navbar