import { useEffect, useState } from 'react';
import { PiMagicWand } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";

const ArticleMenu = () => {
    return (
        <>
            <div className="custom-buttons-ai">
                <div className="cursor-pointer bg-transparent border-0 shadow-none text-white text-2xl p-0">
                    <IoLanguage />
                </div>
                <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
                    <div tabIndex={0} className=" ai-menu-btn my-1"> <PiMagicWand />
                        AI Enhancer</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2  dropdown-menu-ai">
                        <li><a>Regenerate with AI</a></li>
                        <li><a>Make it Concise</a></li>
                        <li><a>Enhance Clarity</a></li>
                        <li><a>Step-by-Step Breakdown</a></li>
                        <li><a>Merge Similar Steps</a></li>
                        <li><a>Reorganize for Better Flow</a></li>
                        <li><a>Formal/Conversational </a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
export default ArticleMenu;