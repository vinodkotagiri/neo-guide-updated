
import {BeatLoader} from 'react-spinners'
function LocalLoader({color,text='loading',progress=70}:{text:string,progress:number,color?:string,}) {

  return (
    <div className='w-full h-full flex items-center justify-center absolute flex-col gap-4'>
      <BeatLoader size={16}  color={`${color??'#02BC7D'}`}/>
      {progress?<progress className='progress w-[60%]' value={progress} max={100}/>:''}
      {text?<div className='capitalize text-[#02BC7D] text-center font-thin'>{progress?text+' ('+progress+'%) ':text}</div>:''}
    </div>
  )
}

export default LocalLoader