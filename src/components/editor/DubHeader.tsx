import React from 'react'
import { getFormattedLanguages } from '../../helpers'

function DubHeader() {
  return (
    <div className="w-full dropdown border-b-[1px] border-slate-600 flex items-center justify-between px-2">
      <div>
        <div className='lf english-us'/>Suman
      </div>
      <details>
    <summary className="btn m-1 bg-transparent  shadow-none outline-none border-none w-content text-blue-400">Change Voice</summary>
    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
    </ul>
      </details>
  </div>
  )
}

export default DubHeader