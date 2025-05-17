//@ts-nocheck
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Editor from './views/Editor'
import { Toaster } from 'react-hot-toast'
import UploadView from './views/upload'
import RecorderPage from './views/RecorderView'
import { useAppDispatch } from './redux/hooks'
import { init, setVideoUrl, updateSubtitleData } from './redux/features/videoSlice'
import { setArticleData } from './redux/features/articleSlice'

if (typeof global === "undefined") {
  global = window;
}

const App = () => {
  const dispatch = useAppDispatch()
  // React.useEffect(() => {
  //   let url = '';
  //   let articleData:Array<{text:string,image_url:string}> = [];
  //   let subtitles: Array<{end_time:string;start_time:string;text:string}> = [];
  //   if (window.localStorage.getItem('url')) {
  //     url = window.localStorage.getItem('url')
  //     if (url) dispatch(setVideoUrl(url));
  //   }
  //   if (window.localStorage.getItem('articleData')) {
  //     articleData =JSON.parse( window.localStorage.getItem('articleData'))
  //     if (articleData?.length) dispatch(setArticleData(articleData))
  //   }
  //   if (window.localStorage.getItem('subtitles')) {
  //     subtitles =JSON.parse( window.localStorage.getItem('subtitles'))
  //     if(subtitles?.length) dispatch(updateSubtitleData(subtitles))
  //   }
  // }, [])
  useEffect(() => {
    // dispatch(init());
  }, [dispatch]);

  return (
    <div className='w-screen h-screen '>
      <Routes>
        <Route path='/' element={<div className='bg-[#16151a] h-full flex items-center justify-center text-white text-2xl'>Welcome to Neo Guide</div>} />
        <Route path='/upload' element={<UploadView />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/recorder' element={<RecorderPage />} />
      </Routes>
      <Toaster position="top-right" 
      toastOptions={{
        style:{
          padding: '16px',
          color: '#713200',
          fontSize:14
        },
        success:{
          style:{
            border:"2px solid #008000",
            color:'#008000'
          }
        },error:{
          style:{
            border:"2px solid #800000",
            color:'#800000'
          }
        },
      }}
      />
    </div>
  )
}

export default App