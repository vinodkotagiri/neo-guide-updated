import { Route, Routes } from 'react-router-dom'
import Editor from './views/Editor'
import Loader from './components/global/Loader'
import { useAppSelector } from './redux/hooks'
import { Toaster } from 'react-hot-toast'
import UploadView from './views/upload'
import RecorderPage from './views/RecorderView'

if (typeof global === "undefined") {
  global = window;
}
const App = () => {
  const {loading}=useAppSelector(state=>state.loader)
  
  return (
    <div className='w-screen h-screen bg-slate-900 text-slate-200'>
      <Routes>
        <Route path='/' element={<UploadView/>}/>
        <Route path='/editor' element={<Editor/>}/>
        <Route path='/recorder' element={<RecorderPage/>}/>
      </Routes>
      {loading?<Loader/>:''}
      <Toaster/>
    </div>
  )
}

export default App