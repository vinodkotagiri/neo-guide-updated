import { useEffect } from "react"
import { handleReplaceText, setFindText, setReplaceText } from "../../redux/features/articleSlice"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md"
import { handleReplaceSubtitleText } from "../../redux/features/videoSlice"

function FindAndReplaceComponent({ setShowReplace, subtitle }: { setShowReplace: (val: boolean) => void, subtitle: boolean }) {
  const dispatch = useAppDispatch()
  const { findText, replaceText } = useAppSelector(state => state.article)

  useEffect(() => {
    const contentId = subtitle ? 'subtitle-content' : 'dub-text-content'
    const para = document.getElementsByClassName(contentId);
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
    if (subtitle) {
      dispatch(handleReplaceSubtitleText({ findText, replaceText }))
    } else {
      dispatch(handleReplaceText())
    }
    setShowReplace(false)
  }

  return (

    <div className="absolute top-[50px] bg-[#16151a]  z-50 w-[98%] flex flex-col gap-1  pr-2 ">
      <div className="flex">
        <input className=" mt-2  px-2  py-3  text-xs     outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op grow" placeholder='Find' onChange={(e) => dispatch(setFindText(e.target.value))} />
        {/* <button className="text-[28px] shrink-0 text-[#77767b] cursor-pointer">
          <MdOutlineKeyboardArrowUp />
        </button>
        <button className="text-[28px] shrink-0 text-[#77767b] cursor-pointer">
          <MdOutlineKeyboardArrowDown />
        </button> */}
      </div>
      <input className="mt-2  px-2  py-3  text-xs     outline-none rounded-md  border-[#303032]   text-[#a3a3a5]  cursor-pointer dd_bg_op" placeholder='Replace' onChange={(e) => dispatch(setReplaceText(e.target.value))} />
      <div className="flex justify-between gap-2 mb-4">

        <button className="bg-[#212025] cursor-pointer text-[#ffffff] py-2 font-semibold text-[14px] rounded-md  border-[#303032]  border  mt-2 grow "  >Cancel</button>
        <button className="bg-[#422ad5] cursor-pointer text-[#ffffff] py-2 font-semibold text-[14px] rounded-md  border-[#303032]  border  mt-2 grow" onClick={handleReplace}>Replace All</button>
      </div>
    </div>
  )
}

export default FindAndReplaceComponent