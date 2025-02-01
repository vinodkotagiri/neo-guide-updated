import { Route, Routes } from 'react-router-dom'
import Editor from './views/Editor'
import { Toaster } from 'react-hot-toast'
import UploadView from './views/upload'
import RecorderPage from './views/RecorderView'

if (typeof global === "undefined") {
  global = window;
}
const App = () => {
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