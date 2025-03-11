import { GoArrowLeft } from 'react-icons/go'
import { useAppSelector } from '../../redux/hooks'
import LocalLoader from '../global/LocalLoader'
import { FaArrowLeft, FaRegTrashAlt } from 'react-icons/fa'

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
          {articleData.map((item: { text: string, image_url: string }) =>
            <>
              <div className='relative img_op'>
                {item.image_url &&
                  <>
                    <img src={item.image_url} alt='img' />
                    <div className='  img_del' ><FaArrowLeft /> <FaRegTrashAlt />

                    </div>
                  </>
                }
              </div>
              {item.text && (
                <div
                  className='w-full h-auto p-2 py-4 text-[#ccc]'
                  dangerouslySetInnerHTML={{ __html: item.text }} // Render HTML content
                  contentEditable
                />
              )}
            </>
          )}
        </div>}
    </div>
  )
}

export default DubContent