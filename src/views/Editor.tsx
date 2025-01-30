
import Article from '../components/editor/Article'
import EditorSider from '../components/editor/EditorSider'
import VideoEditor from '../components/editor/VideoEditor'
import Navbar from '../components/global/Navbar'
import { useAppSelector } from '../redux/hooks'

const Editor = () => {
  const {isArticle}=useAppSelector(state=>state.video)
  return (
    <div className='w-full h-full'>
      <Navbar from={'editor'}/>
      <div className='w-full h-[calc(100vh-64px)] flex p-2 gap-1 '>
       {isArticle?<Article/> :<>
        <div className='w-[80%] h-full rounded-md overflow-hidden'>
          <VideoEditor />
        </div>
        <div className='w-[15%] h-full rounded-md overflow-hidden'>
          <EditorSider />
        </div>
        </>}
      </div>
    </div>
  )
}

export default Editor