import { useEffect, useState } from 'react';
import { PiMagicWand } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import { enhanceAIArticle, getProgress } from '../../api/axios';
import { useAppSelector } from '../../redux/hooks';
import { setArticleData } from '../../redux/features/articleSlice';
import { useDispatch } from 'react-redux';
import { setLoader, setLoaderData } from '../../redux/features/loaderSlice';
import toast from 'react-hot-toast';

const ArticleMenu = ({ languageIcon }) => {
  const { articleData } = useAppSelector(state => state.article)
  const dispatch = useDispatch()
  async function handleRegenerateAI() {
    const response = await enhanceAIArticle({ json_content: articleData })
    if (response?.request_id) {
      dispatch(setLoader({ loading: true }))
      const progessInterval = setInterval(() => {
        getProgress(response?.request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            dispatch(setArticleData(res?.result));
            dispatch(setLoader({ loading: false }))
          } else if (res?.status?.toLowerCase().includes('error')) {
            clearInterval(progessInterval)
            toast.error(JSON.stringify(res?.status?.toLowerCase()));
            dispatch(setLoader({ loading: false }))
          }

          else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        })
      }, 5000)
    } else {
      dispatch(setLoader({ loading: false }))
      toast.error('Error dubbing/translating video');
    }
  }
  return (
    <>
      <div className="custom-buttons-ai">
        {languageIcon && (
          <div className="cursor-pointer bg-transparent border-0 shadow-none text-white text-2xl p-0">
            <IoLanguage />
          </div>
        )}
        <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
          <div tabIndex={0} className={languageIcon ? "  ai-menu-btn my-1 " : " ai-menu-btn my-1 bg-color-dark "}> <PiMagicWand />
            AI Enhancer</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2  dropdown-menu-ai">
            <li><a onClick={handleRegenerateAI}>Regenerate with AI</a></li>
            <li><a>Make it Concise</a></li>
            <li><a>Enhance Clarity</a></li>
            <li><a>Step-by-Step Breakdown</a></li>
            <li><a>Merge Similar Steps</a></li>
            <li><a>Reorganize for Better Flow</a></li>
            <li><a>Formal/Conversational </a></li>
          </ul>
        </div>
      </div >
    </>
  )
}
export default ArticleMenu;