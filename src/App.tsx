import { Route, Routes } from 'react-router-dom'
import Editor from './views/Editor'
import { Toaster } from 'react-hot-toast'
import UploadView from './views/upload'
import RecorderPage from './views/RecorderView'
import CountDownTimer from './components/global/CountDownTimer'
import InteractiveScreenRecorder from './components/InteractiveAnnotationRecorder'

if (typeof global === "undefined") {
  global = window;
}

const App = () => {
  return (
    <div className='w-screen h-screen '>
      <Routes>
        <Route path='*' element={<div className='bg-[#16151a] h-full flex items-center justify-center text-white text-2xl'>
          <CountDownTimer/>
          </div>} />
          <Route path='/record' element={<InteractiveScreenRecorder />} />
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