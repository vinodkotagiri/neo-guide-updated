import  { useRef } from 'react'
import Player from './Player'
import Controls from './Controls'

const VideoEditor = () => {
  const playerRef=useRef(null);
  return (
    <div className='w-full h-full flex flex-col gap-1 '>

      <div className='w-full h-[75%]'>
        <Player playerRef={playerRef}/>
      </div>
      <div className='w-full h-[25%] p-2'>
        <Controls playerRef={playerRef}/>
      </div>
    </div>
  ) 
}

export default VideoEditor


// {
//   "progress": 100,
//   "result": {
//       "dubbed_video_url": "https://effybiz-devops.s3.ap-south-1.amazonaws.com/processed/dubbed_video.mp4",
//       "translation_url": "https://effybiz-devops.s3.ap-south-1.amazonaws.com/processed/translated_sentences.json"
//   },
//   "status": "Completed"
// }
// [
//   {
//       "text": "मुझे पैलिस्टीनी लोगों की किस्मत से दुःख हुआ।",
//       "start": 0.0,
//       "end": 3.72
//   },
//   {
//       "text": "वे एक बहुत अच्छे जीवन के लायक हैं।",
//       "start": 4.18,
//       "end": 6.44
//   },
//   {
//       "text": "वे अपनी असाधारण क्षमता को प्राप्त करने का मौका पाने के हकदार हैं।",
//       "start": 7.0,
//       "end": 11.06
//   },
//   {
//       "text": "फ़िलिस्तीनी आतंकवाद के चक्र में फंसे हुए हैं।",
//       "start": 11.8,
//       "end": 15.48
//   },
//   {
//       "text": "गरीबी और हिंसा, जिनका उपयोग उनके मोहरे बनाने वाले व्यक्तियों द्वारा शोषित किया जा रहा है।",
//       "start": 15.8,
//       "end": 20.5
//   },
//   {
//       "text": "आतंकवाद और उग्रवाद को बढ़ावा देना।",
//       "start": 20.5,
//       "end": 22.56
//   }
// ]