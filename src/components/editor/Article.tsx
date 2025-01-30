// @ts-nocheck
import {  useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import ArticleViewer from "./ArticleViewer";
import ArticleEditor from "./ArticleEditor";
import { FaEdit, FaEye } from "react-icons/fa";


function Article() {
  const [editing,setEditing]=useState(false);
  const {articleData}=useAppSelector(state=>state.article)

  return (
    <div className="w-[90%] items-center justify-center p-2 relative h-full bg-slate-700 flex gap-2 bg-slate-800" >
      <div className="w-full h-full rounded-md flex flex-col gap-3 bg-slate-800">
      <div className="h-10 w-full  border-[1px] border-primary rounded-md bg-purple-600 text-slate-200 flex items-center">
       <div className="tooltip tooltip-right  " data-tip={editing?"view":"edit"}>
        <button 
         className="btn btn-ghost hover:bg-transparent outline-none border-none shadow-none"
         onClick={()=>setEditing(!editing)}
         >{editing?<FaEye size={24}/>:<FaEdit size={24}/>}</button>
         </div>
      </div>
      {!editing?<ArticleViewer articleData={articleData}/>:<ArticleEditor articleData={articleData} />}
      </div>
    </div>
  )
}

export default Article