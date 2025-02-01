
import { useEffect } from 'react'
import Article from '../components/editor/Article'
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'
import { useAppSelector } from '../redux/hooks'
import { createArticle } from '../api/axios'

const Editor = () => {
  const { isArticle,url } = useAppSelector(state => state.video)
  useEffect(()=>{
    getArticleData()
  },[])

  async function getArticleData(){
    const response=await createArticle({video_url:url})
    console.log(response);
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