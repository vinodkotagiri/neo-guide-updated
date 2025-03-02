import { useAppSelector } from '../../redux/hooks'
import LocalLoader from '../global/LocalLoader'

function DubContent() {
  const { articleData } = useAppSelector(state => state.article)
  const { percentage, status } = useAppSelector(state => state.loader)
  return (
    <div className='w-full h-full'>
      {articleData.length == 0 ? <div className='w-full h-full overflow-auto relative '>
        <LocalLoader progress={percentage} text={status} />
      </div>
        :
        <div className='w-full h-full  p-4 pt-0 scrollbar overflow-y-scroll'>
          {articleData.map((item: { text: string, image_url: string }, index: number) =>
            <>
              {item.image_url && <img src={item.image_url} alt='img' />}
              {
                item.text && <div key={index} className='w-full h-auto  p-2 py-4 text-[#ccc]' contentEditable>{item.text}</div>
              }
            </>
          )}
        </div>}
    </div>
  )
}

export default DubContent