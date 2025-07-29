import { useEffect, useState } from 'react';
import { PiDownload, PiExport, PiMagicWand } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import { articleStep, conciseArticle, enhanceAIArticle, getProgress, rephraseArticle } from '../../api/axios';
import { useAppSelector } from '../../redux/hooks';
import { setArticleData } from '../../redux/features/articleSlice';
import { useDispatch } from 'react-redux';
import { setLoader, setLoaderData } from '../../redux/features/loaderSlice';
import toast from 'react-hot-toast';

const ArticleMenu = ({ languageIcon,handleSave }) => {
  const { articleData } = useAppSelector(state => state.article)
  const [requestId, setRequestId] = useState('')
  const dispatch = useDispatch()
  async function handleClick(event) {
    dispatch(setLoader({ loading: true }));
    let response;
    if (event == 'enhance') {
      response = await enhanceAIArticle({ json_content: articleData })
    }
    else if (event == 'concise') {
      response = await conciseArticle({ json_content: articleData })
    }
    else if (event == 'clarity') {
      response = await rephraseArticle({ json_content: articleData })
    }
    else if (event == 'breakdown') {
      response = await articleStep({ json_content: articleData })
    }

    if (response?.request_id) {
      setRequestId(response?.request_id)
    } else {
      dispatch(setLoader({ loading: false }))
      toast.error('error generating')
    }

  }
  useEffect(() => {
    if (requestId) {
      getArticleData(requestId)
    }
  }, [requestId])

  async function getArticleData(request_id: string) {
    if (request_id) {

      const progessInterval = setInterval(() => {
        dispatch(setLoader({ loading: true }))
        getProgress(request_id).then(res => {
          if (res?.status?.toLowerCase() == 'completed') {
            clearInterval(progessInterval)
            dispatch(setLoader({ loading: false }))
            const data = res?.result;
            dispatch(setArticleData(data))
          } else {
            dispatch(setLoaderData({ status: res?.status, percentage: res?.progress }))
          }
        }).catch(() => {
          dispatch(setLoader({ loading: false }))
          toast.error('Error Enhancing Article')
        })
      }, 5000)
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
          <div tabIndex={0} className=" ai-menu-btn my-1 bg-color-dark "> <PiDownload />
            Dowload</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32  px-1 py-2  dropdown-menu-ai">
            <li ><button onClick={()=>handleSave('docx')}>As Document</button></li>
            <li ><button onClick={() => handleSave('pdf')}>As PDF</button></li>

          </ul>
        </div>
        <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">

          <div tabIndex={0} className={languageIcon ? "  ai-menu-btn my-1 " : " ai-menu-btn my-1 bg-color-dark "}> <PiMagicWand />
            AI Enhancer</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 px-1 py-2  dropdown-menu-ai">
            <li><a onClick={() => handleClick('enhance')}>Regenerate with AI</a></li>
            <li><a onClick={() => handleClick('concise')}>Make it Concise</a></li>
            <li><a onClick={() => handleClick('clarity')}>Enhance Clarity</a></li>
            <li><a onClick={() => handleClick('breakdown')}>Step-by-Step Breakdown</a></li>
            {/* <li><a onClick={()=>handleClick('steps')}>Merge Similar Steps</a></li> */}
            {/* <li><a onClick={()=>handleClick('reorg')}>Reorganize for Better Flow</a></li> */}
            {/* <li><a onClick={()=>handleClick('formal')}>Formal/Conversational </a></li> */}
          </ul>
        </div>
      </div >
    </>
  )
}
export default ArticleMenu;