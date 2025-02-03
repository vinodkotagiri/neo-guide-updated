import { ClockLoader } from "react-spinners";
import { useAppSelector } from "../../redux/hooks";

const Loader = () => {
  const { status, percentage, loading } = useAppSelector((state) => state.loader);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center gap-2 items-center bg-black bg-opacity-90 z-[9999]">
      <ClockLoader size={64} color="#dfdfdf" />

      <div className="flex flex-col items-center justify-center">
        {percentage && <div className="capitalize text-slate-400 text-center font-bold font-serif">{percentage}%</div>}
        <div className="capitalize text-slate-400 text-center font-thin">{status}...</div>
      </div>
    </div>
  );
};

export default Loader;
