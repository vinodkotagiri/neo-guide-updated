import { useAppSelector } from "../../redux/hooks"
import DocxViewerEditor from "./DocxViewerEditor"

function Article() {
  const {url}=useAppSelector(state=>state.article)
  return (
    <div className="w-full p-2 h-full bg-slate-700 flex gap-2">
      <div className="w-[80%] h-full bg-black rounded-md">
        <DocxViewerEditor fileUrl={url}/>
      </div>
      <div className="w-[20%] h-full bg-black rounded-md">

      </div>
    </div>
  )
}

export default Article