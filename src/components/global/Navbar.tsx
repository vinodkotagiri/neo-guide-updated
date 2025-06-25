//@ts-nocheck
import { setIsArticle, setReferenceId, setSourceLang, setSourceLangName, setTargetLanguage, setVideoName, setVideoUrl, setVoice, setVoiceId, setVoiceLanguage, updateSubtitleData } from "../../redux/features/videoSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import logo from '../../assets/images/neo-logo.png'
import { IoMdCloudDone, IoMdCloudUpload } from "react-icons/io";
import { PiExportBold } from "react-icons/pi";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { exportOrupdateJSON, exportOrupdateProject, exportVideo, getVersionData, getVersions, trackExportProgress } from "../../api/axios";
import { MdContentCopy, MdHistory, MdOutlineArticle } from "react-icons/md";
import { IoChevronDown, IoClose } from "react-icons/io5";
import { CiExport, CiLogout, CiUser } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin6Line, RiFileVideoLine } from "react-icons/ri";
import { BsFiletypeGif } from "react-icons/bs";
import { convertToIST } from "../../helpers";
import { Navigate } from "react-router-dom";
import { setArticleData } from "../../redux/features/articleSlice";
import { addArrow, addBlur, addRectangle, addSpotLight, addText, addZoom, resetElements } from "../../redux/features/elementsSlice";
import { setVersions } from "../../redux/features/videoSlice";
import { setLoader } from "../../redux/features/loaderSlice";
interface NavbarProps {
  from?: string,
  hideMenu?: string,
}




function Navbar({ from, hideMenu }: NavbarProps) {
  const { isArticle, videoName, videoHeight, videoWidth, url, user_id, user_name, subtitles, reference_id, sourceLang, sourceLangName, targetLang, targetLangName, voice, voice_language, voiceid, versions } = useAppSelector(state => state.video)
  const { articleData } = useAppSelector(state => state.article)
  const dispatch = useAppDispatch()
  const [token, setToken] = useState('')
  const [uniqueId, setUniqueId] = useState('')
  const [subtitleId, setSubtitleId] = useState('')
  const [articleId, setArticleId] = useState('')

  const [selectedVersion, setSelectedVersion] = useState({ index: 0, text: '' })

  function handleVideoArticleSwitch() {
    dispatch(setIsArticle(!isArticle))
  }
  const { rectangles, arrows, texts, spotLights, blurs, zooms } = useAppSelector(state => state.elements)
  useEffect(() => {
    if (token) {
      trackProgress(token);
    }
  }, [token]);
  const [open, setOpen] = useState<string | null>("Docs");
  function handleExport() {
    const payload = {
      video: url,
      videoWidth,
      videoHeight,
        rectangles: rectangles.map(rect => ({
        ...rect,
        width:  parseInt(((rect.width / videoWidth) * 100).toFixed(2)),
        height:  parseInt(((rect.height / videoHeight) * 100).toFixed(2)),
        x:  parseInt(((rect.x / videoWidth) * 100).toFixed(2)),
        y: parseInt(((rect.y / videoHeight) * 100).toFixed(2)),
        cornerRadius: rect.cornerRadius.map(radius => (parseInt((radius / videoWidth) * 100).toFixed(2)))
      })),
      arrows: arrows.map(arrow => ({
        ...arrow,
        strokeWidth:  parseInt(((arrow.strokeWidth / videoWidth) * 100).toFixed(2)),
        pointerLength:  parseInt(((arrow.pointerLength / videoWidth) * 100).toFixed(2)),
        pointerWidth:  parseInt(((arrow.pointerWidth / videoWidth) * 100).toFixed(2)),
        x:  parseInt(((arrow.x / videoWidth) * 100).toFixed(2)),
        y:  parseInt(((arrow.y / videoHeight) * 100).toFixed(2)),
        points: arrow.points.map(point => ( parseInt((point / videoWidth) * 100).toFixed(2)))
      }))
      , texts: texts.map(text => ({
        ...text,
        x:  parseInt(((text.x / videoWidth) * 100).toFixed(2)),
        y:  parseInt(((text.y / videoHeight) * 100).toFixed(2)),
      })),
      spotLights: spotLights.map(spot => ({
        ...spot,
        x:  parseInt(((spot.x / videoWidth) * 100).toFixed(2)),
        y:  parseInt(((spot.y / videoHeight) * 100).toFixed(2)),
        width:  parseInt(((spot.width / videoWidth) * 100).toFixed(2)),
        height:  parseInt(((spot.height / videoHeight) * 100).toFixed(2)),
        cornerRadius: spot.cornerRadius.map(radius => ( parseInt((radius / videoWidth) * 100).toFixed(2)))
      })),
      blurs: blurs.map(blur => ({
        ...blur,
        x:  parseInt(((blur.x / videoWidth) * 100).toFixed(2)),
        y:  parseInt(((blur.y / videoHeight) * 100).toFixed(2)),
        width:  parseInt(((blur.width / videoWidth) * 100).toFixed(2)),
        height:  parseInt(((blur.height / videoHeight) * 100).toFixed(2)),
        blurRadius:  parseInt(((blur.blurRadius / videoWidth) * 100).toFixed(2))
      }
      )),
      zooms: zooms.map(zoom => (
        {
          ...zoom,
          roi: {
            x:  parseInt(((zoom.roi.x / videoWidth) * 100).toFixed(2)),
            y:  parseInt(((zoom.roi.y / videoHeight) * 100).toFixed(2)),
            width:  parseInt(((zoom.roi.width / videoWidth) * 100).toFixed(2)),
            height:  parseInt(((zoom.roi.height / videoHeight) * 100).toFixed(2))
          }
        }))
      }
      if(rectangles.length==0) delete payload.rectangles
      if(arrows.length==0) delete payload.arrows
      if(texts.length==0) delete payload.texts
      if(spotLights.length==0) delete payload.spotLights
      if(blurs.length==0) delete payload.blurs
      if(zooms.length==0) delete payload.zooms

    exportVideo(payload).then(token => {
      if (token) {
        setToken(token)
        toast.success('Exporting video, token:')
      } else {
        toast.error('Something went wrong while exporting video')
      }
    }).catch(() => { })
  }

  async function handleRestoreVersion() {
    try {
      if (selectedVersion?.index) {
        await getVersionData(selectedVersion.index).then((res) => {
          console.log('restored version:', res);
          dispatch(setSourceLang(res?.sourceLang));
          dispatch(setSourceLangName(res?.sourceLangName));
          dispatch(setTargetLanguage(res?.targetLang));
          dispatch(setVoiceLanguage(res?.voice_language));
          dispatch(setVoiceId(res?.voiceid));
          dispatch(setVoice(res?.voice));
          // dispatch(updateSubtitleData(res?.subtitles));
          // dispatch(setArticleData(res?.article));
          const elements = typeof res?.elements == 'string' ? JSON.parse(res?.elements) : res?.elements
          // const videoUrl = elements?.videoUrl;
          // dispatch(setVideoUrl(videoUrl));
          const videoWidth = parseInt(elements?.videoWidth);
          const videoHeight = parseInt(elements?.videoHeight);
          dispatch(resetElements())
          const rectangles = elements?.rectangles ? elements?.rectangles.map(rect => ({
            ...rect,
            width: parseInt((parseFloat(rect.width) * videoWidth) / 100),
            height: parseInt((parseFloat(rect.height) * videoHeight) / 100),
            x: (parseInt(parseFloat(rect.x) * videoWidth) / 100),
            y: parseInt((parseFloat(rect.y) * videoHeight) / 100),
            cornerRadius: rect.cornerRadius.map(radius => parseInt((parseFloat(radius) * videoWidth) / 100))
          })) : []
          rectangles.forEach((rect) => {
            dispatch(addRectangle(rect));
          })
          const arrows = elements.arrows ? elements?.arrows.map(arrow => ({
            ...arrow,
            strokeWidth: parseInt((parseFloat(arrow.strokeWidth) * videoWidth) / 100),
            pointerLength: parseInt((parseFloat(arrow.pointerLength) * videoWidth) / 100),
            pointerWidth: parseInt((parseFloat(arrow.pointerWidth) * videoWidth) / 100),
            x: parseInt((parseFloat(arrow.x) * videoWidth) / 100),
            y: parseInt((parseFloat(arrow.y) * videoHeight) / 100),
            points: arrow.points.map(point => parseInt((parseFloat(point) * videoWidth) / 100))
          })) : []
          arrows.forEach((arrow) => {
            dispatch(addArrow(arrow));
          })
          const texts = elements?.texts ? elements?.texts.map(text => ({
            ...text,
            x: parseInt((parseFloat(text.x) * videoWidth) / 100),
            y: parseInt((parseFloat(text.y) * videoHeight) / 100)
          })) : []
          texts.forEach((text) => {
            dispatch(addText(text));
          })
          const spotLights = elements?.spotLights ? elements?.spotLights.map(spot => ({
            ...spot,
            x: parseInt((parseFloat(spot.x) * videoWidth) / 100),
            y: parseInt((parseFloat(spot.y) * videoHeight) / 100),
            width: parseInt((parseFloat(spot.width) * videoWidth) / 100),
            height: parseInt((parseFloat(spot.height) * videoHeight) / 100),
            cornerRadius: spot.cornerRadius.map(radius => parseInt((parseFloat(radius) * videoWidth) / 100))
          })) : []
          spotLights.forEach((spot) => {
            dispatch(addSpotLight(spot));
          })
          const blurs = elements?.blurs ? elements?.blurs.map(blur => ({
            ...blur,
            x: parseInt((parseFloat(blur.x) * videoWidth) / 100),
            y: parseInt((parseFloat(blur.y) * videoHeight) / 100),
            width: parseInt((parseFloat(blur.width) * videoWidth) / 100),
            height: parseInt((parseFloat(blur.height) * videoHeight) / 100),
            blurRadius: parseInt((parseFloat(blur.blurRadius) * videoWidth) / 100)
          })) : []
          blurs.forEach((blur) => {
            dispatch(addBlur(blur));
          })
          const zooms = elements?.zooms ? elements.zooms.map(zoom => ({
            ...zoom,
            roi: {
              x: parseInt((parseFloat(zoom.roi.x) * videoWidth) / 100),
              y: parseInt((parseFloat(zoom.roi.y) * videoHeight) / 100),
              width: parseInt((parseFloat(zoom.roi.width) * videoWidth) / 100),
              height: parseInt((parseFloat(zoom.roi.height) * videoHeight) / 100)
            }
          })) : []
          zooms.forEach((zoom) => {
            dispatch(addZoom(zoom));
          })

          toast.success(`Version restored Successfully: ${selectedVersion.text}`)
        })
      }
    } catch (error) {
      console.log("error restoring version", error);
      return toast.error("Error restoring version")
    }
  }

  async function trackProgress(request_id) {
    if (request_id) {
      const interval = setInterval(() => {
        trackExportProgress(request_id).then(async (res) => {
          if (res?.progress == 100) {
            clearInterval(interval);
            const data = res?.video_url;
            await downloadVideo(data);
            if (data?.error) {
              toast.error(data?.error);
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
    try{
if(!articleData.length) return toast.error('Article data not loaded yet!');
    if(!subtitles.data.length) return toast.error('Subtitle data not loaded yet!');
    dispatch(setLoader({ loading: true, status: 'please wait while we save the video' }));
    if (!uniqueId) {
      setUniqueId(Date.now().toString())
    }
    const video = url ? url.split('/').pop() : ''
    const subtitlePayload = subtitles.data
    const articlePayload = articleData
    let payload = {}
    if (!reference_id) {
      if (subtitlePayload?.length && articlePayload?.length) {
        await exportOrupdateJSON({ json: subtitlePayload, action: subtitleId ? "update" : "insert", filename: `${uniqueId}-subtitle.json` }).then(res => {
          if (res.file_url) {
            setSubtitleId(res.file_url.split('/').pop())
          }
        }).catch(err => console.log(err))
        await exportOrupdateJSON({ json: articlePayload, action: articleId ? "update" : "insert", filename: `${uniqueId}-article.json` }).then(res => {
          if (res.file_url) setArticleId(res.file_url.split('/').pop())
        }).catch(err => console.log(err))
        payload = {
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
          data: {
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
        exportOrupdateProject(payload).then(res => {
          if (res.reference_id) {
            dispatch(setReferenceId(res.reference_id))
            return toast.success("Project saved successfully")
          }
        }).catch(err => {
          console.log(err)
          return toast.error("Error in saving project")
        })
      }
      
    } else {
      payload = {
        reference_id: reference_id,
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
        data: {
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
      exportOrupdateProject(payload).then(async () => {
        await updateVersions(reference_id)
        return toast.success('Project updated successfully');
      }).catch(err => console.log(err))
    }
    }catch(err){
      console.log(err);
      toast.error("Error saving video")
    }finally{
      dispatch(setLoader({ loading: false }))
    }
  }

  useEffect(() => {
    (async () => {
      if (reference_id) {
        await updateVersions(reference_id);
      }
    })()
  }, [reference_id])

  async function updateVersions(refId: string) {
    getVersions(refId).then((result) => {
      if (result?.length) {
        dispatch(setVersions(result))
      }
    }).catch((err) => {
      console.log('err', err)
      dispatch(setVersions([]))
    });
  }

  return (
    <div className="navbar ">
      <div className="navbar-inside">
        <div className="px-4 flex  items-center justify-center gap-6">
          <a href="#"><img src={logo} alt="logo" className="w-6 shrink-0" /></a>
          {!hideMenu && <input type="text" onChange={(e) => dispatch(setVideoName(e.target.value))} value={videoName ?? "untitled project name"} className="text-[#a3a3a3] border-1 border-[#4b4b4b]   rounded-md px-2 py-1 w-[350px]" />
          }
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
                  <h3 className="text-2xl text-white border-b-[1px] border-[#303032] pb-4 capitalize">{user_name}</h3>
                  <aside className="text-white    mt-4">
                    <ul className="space-y-2">
                      <li onClick={() => window.location.replace('https://contentinova.com/userdashboard')}>
                        <a href="#" className="flex items-center gap-2 py-1">
                          <CiUser />
                          <span>Go to Dashboard</span>
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
                          <ul className="p-0 m-0 flex items-center justify-center flex-col text-xs italic">
                            {versions?.length ? versions.map((version) => (
                              <li className="cursor-pointer p-0 m-0  hover:bg-slate-800 hover:text-sm hover:rounded-md h-6 flex items-center justify-center " onClick={() => {
                                setSelectedVersion({ text: `${version.id} - ${convertToIST(version.tstamp)}`, index: version.id })
                                document.getElementById('my_modal_3')?.showModal()
                              }}>
                                <MdHistory />
                                <span>Version {`${version.id} - ${convertToIST(version.tstamp)}`}</span>
                              </li>
                            )) : <li className='text-center'>No versions found</li>}
                          </ul>
                        )}
                      </li>
                      {/* <li>
                        <a href="#"  >
                          <MdContentCopy />
                          <span>Make a copy</span>
                        </a>
                      </li> */}
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
                          <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-300 p-0 m-0 flex items-start justify-center flex-col ">
                            <li onClick={handleExport} className="cursor-pointer px-4 p-0 m-0  hover:bg-slate-800 hover:text-sm hover:rounded-md h-6 flex items-start w-full justify-center italic" > Video </li>
                            <li className="cursor-pointer p-0  px-4 m-0  hover:bg-slate-800 hover:text-sm hover:rounded-md h-6 flex items-start w-full justify-center italic" >Article</li>
                            <li className="cursor-pointer p-0 m-0  hover:bg-slate-800 hover:text-sm hover:rounded-md h-6 flex items-start w-full px-4 justify-center italic" >Gif</li>

                          </ul>
                        )}
                      </li>
                      <li onClick={saveVideo}>
                        <a >
                          <FaRegSave />
                          <span>Save</span>
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


                <p className="py-4 text-white">{selectedVersion.text}</p>
                <div className="flex gap-2 items-center justify-end">


                  <button className=" cursor-pointer text-[#777] p-3 font-semibold text-[14px] rounded-md  " >Cancel</button>
                  <button className="bg-[#422ad5] cursor-pointer text-[#ffffff] p-3 font-semibold text-[14px] rounded-md" onClick={handleRestoreVersion} >Restore Version</button>
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