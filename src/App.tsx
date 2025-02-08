//@ts-nocheck
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Editor from './views/Editor'
import { Toaster } from 'react-hot-toast'
import UploadView from './views/upload'
import RecorderPage from './views/RecorderView'
import { useAppDispatch } from './redux/hooks'
import { setVideoUrl } from './redux/features/videoSlice'
import { setArticleData } from './redux/features/articleSlice'

if (typeof global === "undefined") {
  global = window;
}

const App = () => {
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    let url = '';
    let articleData:Array<{text:string,image_url:string}> = [];
    
    if (window.localStorage.getItem('url')) {
      url = window.localStorage.getItem('url')
    }
    if (window.localStorage.getItem('articleData')) {
      articleData =JSON.parse( window.localStorage.getItem('articleData'))
    }

    if (articleData.length) dispatch(setArticleData(articleData))
    if (url) dispatch(setVideoUrl(url));

  }, [])

  return (
    <div className='w-screen h-screen '>
      <Routes>
        <Route path='/' element={<UploadView />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/recorder' element={<RecorderPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App