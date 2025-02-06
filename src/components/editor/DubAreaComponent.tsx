import React from 'react'
import DubHeader from './DubHeader'
import DubContent from './DubContent'
import { getFormattedLanguages } from '../../helpers'
console.log(getFormattedLanguages())
function DubAreaComponent() {
  return (
    <div className='w-full flex flex-col'>
      <div className=''>
      <DubHeader/>
      </div>
      <div>
        <DubContent/>
      </div>
    </div>
  )
}

export default DubAreaComponent