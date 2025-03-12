import { useEffect } from "react"
import { highlightFindText, setFindText, setReplaceText } from "../../redux/features/articleSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"

function FindAndReplaceComponent() {
  const dispatch=useAppDispatch()
  const {findText}=useAppSelector(state=>state.article)
  useEffect(()=>{
    dispatch(highlightFindText())
  },[findText])
  return (
    <div className="absolute -bottom-18 bg-slate-800 z-50 w-[200px] flex flex-col gap-1 h-[72px]">
    <input className="input w-[200px] h-8 bg-transparent border-[1px] border-slate-600 outline-none" placeholder='Find' onChange={(e)=>dispatch(setFindText(e.target.value))}/>
    <input className="input w-[200px] h-8 bg-transparent border-[1px] border-slate-600 outline-none" placeholder='Replace' onChange={(e)=>dispatch(setReplaceText(e.target.value))}/>
    </div>
  )
}

export default FindAndReplaceComponent