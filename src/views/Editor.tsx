//@ts-nocheck
import { useEffect, useRef, useState } from 'react'
import Article from '../components/editor/Article'
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'
import { useAppSelector } from '../redux/hooks'
import { createArticle, getProgress, getProjectData } from '../api/axios'
import toast from 'react-hot-toast'
import { hideLoader, setLoader, setLoaderData, showLoader } from '../redux/features/loaderSlice'
import { useDispatch } from 'react-redux'
import { setArticleData } from '../redux/features/articleSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setDisabled, setLocked, setSourceLang, setSourceLangName, setTargetLanguage, setVideoName, setVideoUrl, updateSubtitleData } from '../redux/features/videoSlice'
import { error } from 'console'
import axios from 'axios'
import { restoreElements } from '../redux/features/elementsSlice'

const Editor = () => {
  const { isArticle, url,subtitles,isDisabled } = useAppSelector(state => state.video)
  const { articleData } = useAppSelector(state => state.article)
  const [requestId, setRequestId] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const playerRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const user_id=searchParams.get('user_id') ?? null;
    const reference_id=searchParams.get('reference_id') ?? null;
    if(!url && !user_id && !reference_id) navigate('/');
    if(!url && user_id && reference_id){
      console.log('Restoring project')
      handleRestoreProject(reference_id)
    }
  }, [url, navigate, searchParams])

async function handleRestoreProject(reference_id:string){
  dispatch(showLoader());
  const res=await getProjectData(reference_id)
  if(res){
    dispatch(setVideoName(res.projectname));
    if(res.video){
      dispatch(setVideoUrl(res.video));
    }
    if(res.article){
      dispatch(setLoaderData({status:'Getting Saved Article'}))
      axios.get(res.article).then((res) => {
        dispatch(setArticleData(res.data));
      }).catch(error => {
        console.log(error);
      })
    }
    if(res.subtitle){
      dispatch(setLoaderData({status:'Getting Saved Subtitles'}))
      axios.get(res.subtitle).then((res) => {
        dispatch(updateSubtitleData(res.data));
      }).catch(error => {
        console.log(error);
      })
    }
    if(res.elements){
      dispatch(setLoaderData({status:'Getting Saved Elements'}))
      const elements={}
      if(res.elements?.rectangles?.length){
        elements.rectangles=res.elements.rectangles
      }
      if(res.elements?.arrows?.length){
        elements.arrows=res.elements.arrows
      }
      if(res.elements?.blurs?.length){
        elements.blurs=res.elements.blurs
      }
      if(res.elements?.texts?.length){
        elements.texts=res.elements.texts
      }
      if(res.elements?.spotLights?.length){
        elements.spotLights=res.elements.spotLights
      }
      if(res.elements?.zooms?.length){
        elements.zooms=res.elements.zooms
      }
      console.log('elements',elements)
      if(Object.keys(elements).length){
        dispatch(restoreElements(elements));
      }
    }
    if(res?.sourceLang){
      dispatch(setSourceLang(res.sourceLang));
    }
    if(res?.sourceLangName){
      dispatch(setSourceLangName(res.sourceLangName));
    }
    if(res?.targetLang){
      dispatch(setTargetLanguage(res.targetLang));
    }
    if(res?.targetLangName){
      dispatch(setTargetLanguage(res.targetLangName));
    }
  }
  dispatch(hideLoader());
  toast.success("Project restored successfully")
}

  // useEffect(()=>{
  //   const user_id=searchParams.get('user_id') ?? null;
  //   if(!user_id) toast.error('User ID is required to upload a video');
  //   if(user_id){
  //     dispatch(setUserId(user_id.toString()));
  //   }

  // },[searchParams])

  useEffect(() => {
    if (!articleData.length) {
      // dispatch(setLoader({ loading: true }));
      // dispatch(setLocked(true))
      createArticle({ video_url: url })
        .then((res) => {
          const request_id = res?.request_id;
          if (request_id) {
            setRequestId(request_id);
            // toast.success('Video uploaded successfully');
          } else {
            // toast.error('Forbidden');
          }
        })
        .catch(() => {
          toast.error('Error uploading video');
        })
        .finally(() => {
          dispatch(setLoader({ loading: false }));
          dispatch(setLocked(false))
        });
    }
  }, [url]); // Run when url changes


  useEffect(() => {
    if (requestId) {
      getArticleData(requestId)
    }
  }, [requestId])

  async function getArticleData(request_id) {
    if (request_id) {
      dispatch(setLocked(true))
      const progessInterval = setInterval(() => {
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            const data = res?.result;
            dispatch(setArticleData(data))
            dispatch(setLocked(false))
          } else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    }
  }


  function handleNewUpload() {
    window.localStorage.clear();
    navigate('/')
  }

  useEffect(()=>{
    if( !subtitles.data.length){
      dispatch(setDisabled(true));
    }else{
      dispatch(setDisabled(false));
    }
  },[articleData,subtitles.data,dispatch])



  return (
    <div className='w-full h-full bg-[#16151a]' >
      <Navbar from={'editor'} />
      <div className='w-full h-[calc(100vh-64px)] flex  rounded-md fixed top-[72px]'>

        <dialog id="confirm_new_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Existing Data will be removed. Do you want to continue?</p>
            <div className="modal-action">
              <form method="dialog" className='flex gap-6'>
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-error" onClick={handleNewUpload}>OK</button>
                <button className="btn btn-neutral" >Cancel</button>
              </form>
            </div>
          </div>
        </dialog>

        {isArticle ? <Article /> : <>
          <div className='w-[70%] h-full'>
            <VideoEditor playerRef={playerRef} />
          </div>
          <div className='w-[30%] h-full'>
            <EditorSider playerRef={playerRef} />
          </div>
        </>}
      </div>
    </div>
  )
}

export default Editor