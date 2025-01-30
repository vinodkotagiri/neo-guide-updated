// @ts-nocheck
import {  useState } from "react"
import { useAppSelector } from "../../redux/hooks"
import ArticleViewer from "./ArticleViewer";
import ArticleEditor from "./ArticleEditor";


function Article() {
  const [editing,setEditing]=useState(true);
  const {articleData}=useAppSelector(state=>state.article)

  return (
    <div className="w-[90%] items-center justify-center p-2 h-full bg-slate-700 flex gap-2" style={{backgroundColor:'ghostwhite'}}>
      <div className="w-full h-full bg-black rounded-md">
      {!editing?<ArticleViewer articleData={articleData}/>:<ArticleEditor articleData={articleData} />}
      </div>
    </div>
  )
}

export default Article