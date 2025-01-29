import {ClockLoader} from 'react-spinners'
import { useAppSelector } from '../../redux/hooks'
const Loader = () => {
  const {status,percentage}=useAppSelector(state=>state.loader)
  return (
    <div  className='fixed top-0 left-0 w-screen h-screen flex flex-col justify-center gap-2 items-center bg-black opacity-90 z-[99999]'>
   <ClockLoader size={64} color='#dfdfdf' />
   <div className='flex items-center justify-center flex-col '> 
   {percentage?<div className='capitalize text-slate-400 text-center font-bold font-serif'>{percentage} %</div>:''}
    <div className='capitalize text-slate-400 text-center font-thin'>{status} ...</div>
   </div>
    </div>
  )
}

export default Loader