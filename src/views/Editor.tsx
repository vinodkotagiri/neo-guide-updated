//@ts-nocheck
import { useEffect, useState } from 'react'
import Article from '../components/editor/Article'
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'
import { useAppSelector } from '../redux/hooks'
import { createArticle, getProgress } from '../api/axios'
import toast from 'react-hot-toast'
import { setLoader, setLoaderData } from '../redux/features/loaderSlice'
import { useDispatch } from 'react-redux'
import { setArticleData } from '../redux/features/articleSlice'
import { useNavigate } from 'react-router-dom'
import { setLocked } from '../redux/features/videoSlice'

const Editor = () => {
  const { isArticle, url } = useAppSelector(state => state.video)
  const { articleData } = useAppSelector(state => state.article)
  const [requestId, setRequestId] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // // useEffect(() => {
  //   if (!url) navigate('/')
  //   else
  // }, [url])

  useEffect(() => {
    if (!articleData.length ) {
      dispatch(setLoader({ loading: true }));
      dispatch(setLocked(true))
      createArticle({ video_url: url })
        .then((res) => {
          const request_id = res?.request_id;
          if (request_id) {
            setRequestId(request_id);
            toast.success('Video uploaded successfully');
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


  function handleNewUpload(){
    window.localStorage.clear();
    navigate('/')
  }

  return (
    <div className='w-full h-full bg-slate-900'>
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
          <div className='h-full w-[48px] border-r-[1px] border-slate-700'></div>
          <div className='w-[65%] h-full'>
            <VideoEditor />
          </div>
          <div className='w-[35%] h-full'>
            <EditorSider />
          </div>
        </>}
      </div>
    </div>
  )
}

export default Editor