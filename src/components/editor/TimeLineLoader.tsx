import React from 'react'

function TimeLineLoader({steps,activeStep}) {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <ul className="steps steps-vertical">
        {steps.map(step=>( <li className={step==activeStep?'step step-primary':'step'}>{step}</li>))}
</ul>
    </div>
  )
}

export default TimeLineLoader