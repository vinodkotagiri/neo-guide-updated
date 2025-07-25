import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useNavigate } from 'react-router-dom';
const CountDownTimer = () => {
 const navigate = useNavigate();
 const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    navigate('/record')
    return
  }

  return (
    <div className="flex items-center justify-content-center flex-col text-xs">
      <div className="text">Recording starts in</div>
      <div className="text-2xl">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};
  return (
    <div className='flex items-center justify-center flex-col gap-2 w-screen h-screen fixed top-0 text-white'>
      <CountdownCircleTimer
          isPlaying
          duration={10}
         colors={["#00ff00", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => ({ delay: 10 })}
        >
          {renderTime}
        </CountdownCircleTimer>
    </div>
  )
}

export default CountDownTimer