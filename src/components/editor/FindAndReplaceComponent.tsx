import { useEffect } from "react"
import { handleReplaceText, setFindText, setReplaceText } from "../../redux/features/articleSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"

function FindAndReplaceComponent({setShowReplace}:{setShowReplace:(val:boolean)=>void}) {
  const dispatch = useAppDispatch()
  const { findText } = useAppSelector(state => state.article)

  useEffect(() => {
    const para = document.getElementsByClassName('dub-text-content');
    const regExp = new RegExp(findText, 'gi');

    if (findText !== "") {
      for (const text of para) {
        // Replace the text content with highlighted version
        text.innerHTML = text.textContent.replace(regExp, "<mark>$&</mark>");
      }
    } else {
      // Reset the innerHTML to the original text (remove highlighting)
      for (const text of para) {
        text.innerHTML = text.textContent;
      }
    }
  }, [findText]);

  function handleReplace() {
    dispatch(handleReplaceText())
    setShowReplace(false)
  }

  return (
    <div className="absolute -bottom-26 bg-slate-800 z-50 w-[200px] flex flex-col gap-1 h-content">
      <input className="input w-[200px] h-8 bg-transparent border-[1px] border-slate-600 outline-none" placeholder='Find' onChange={(e) => dispatch(setFindText(e.target.value))} />
      <input className="input w-[200px] h-8 bg-transparent border-[1px] border-slate-600 outline-none" placeholder='Replace' onChange={(e) => dispatch(setReplaceText(e.target.value))} />
      <button className="btn btn-sm btn-primary" onClick={handleReplace}>Replace All</button>
    </div>
  )
}

export default FindAndReplaceComponent