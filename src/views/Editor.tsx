//@ts-nocheck
import { useEffect, useState } from 'react'
import Article from '../components/editor/Article'
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'
import { useAppSelector } from '../redux/hooks'
import { createArticle, getLanguageList, getProgress } from '../api/axios'
import toast from 'react-hot-toast'
import { setLoader, setLoaderData } from '../redux/features/loaderSlice'
import { useDispatch } from 'react-redux'
import { setArticleData } from '../redux/features/articleSlice'

const Editor = () => {
  const { isArticle,url } = useAppSelector(state => state.video)
  const [requestId,setRequestId]=useState('')
  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(setLoader({ loading: true }));
    createArticle({ video_url: url })
      .then((res) => {
        const request_id = res?.request_id;
        if (request_id) {
          setRequestId(request_id);
          toast.success('Video uploaded successfully');
        } else {
          toast.success('Video uploaded successfully');
        }
      })
      .catch(() => {
        toast.error('Error uploading video');
      })
      .finally(() => {
        dispatch(setLoader({ loading: false }));
      });
  }, [url]); // Run when url changes
  

  useEffect(()=>{
    if(requestId){
      getArticleData(requestId)
    }
  },[requestId])
  async function getArticleData(request_id){
    if(request_id){
      dispatch(setLoader({loading:true}))
      const progessInterval=setInterval(()=>{
        getProgress(request_id).then(res=>{
          if(res?.status=='completed'){
            clearInterval(progessInterval)
            const data=res?.result;
            dispatch(setArticleData(data))
            dispatch(setLoader({loading:false}))
          }else{
            dispatch(setLoaderData({status:res?.status, percentage:res?.progress}))
          }
        })
      },1000)
    }
  }

  return (
    <div className='w-full h-full bg-gradient-to-br from-blue-700 to-pink-500 overflow-hidden'>
      <Navbar from={'editor'} />
      <div className='w-full h-[calc(100vh-64px)] flex  rounded-md fixed top-[72px]'>
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