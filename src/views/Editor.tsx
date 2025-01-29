
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'

const Editor = () => {
  return (
    <div className='w-full h-full'>
      <Navbar />
      <div className='w-full h-[calc(100vh-64px)] flex p-2 gap-1 '>
        <div className='w-[85%] h-full rounded-md overflow-hidden'>
          <VideoEditor />
        </div>
        <div className='w-[15%] h-full rounded-md overflow-hidden'>
          <EditorSider />
        </div>
      </div>
    </div>
  )
}

export default Editor