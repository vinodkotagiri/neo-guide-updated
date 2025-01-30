// @ts-nocheck
import {  useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import ArticleViewer from "./ArticleViewer";
import ArticleEditor from "./ArticleEditor";
import { PiNotePencilThin, PiEyeThin } from "react-icons/pi";


function Article() {
  const [editing,setEditing]=useState(false);
  const {articleData}=useAppSelector(state=>state.article)

  return (
    <div className="w-[90%] items-center justify-center p-2 relative h-full  flex gap-2" >
      <div className="w-full h-full rounded-md flex flex-col gap-3">
      <div className="h-10 w-10  border-[1px] border-primary rounded-md bg-gradient-to-br from-fuchsia-900 via-fuchsia-900 to-orange-900 text-slate-200 flex items-center justify-center">
       <div className="tooltip tooltip-right  " data-tip={editing?"view":"edit"}>
        <button 
         className="btn btn-ghost hover:bg-transparent outline-none border-none shadow-none"
         onClick={()=>setEditing(!editing)}
         >{editing?<PiEyeThin size={24}/>:<PiNotePencilThin size={24}/>}</button>
         </div>
      </div>
      {!editing?<ArticleViewer articleData={articleData}/>:<ArticleEditor articleData={articleData} />}
      </div>
    </div>
  )
}

export default Article