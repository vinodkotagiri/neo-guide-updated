import { ScaleLoader } from "react-spinners";
import { useAppSelector } from "../../redux/hooks";

const Loader = () => {
  const { status, percentage, loading } = useAppSelector((state) => state.loader);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center gap-2 items-center bg-black bg-opacity-90 z-[9999]">
      <ScaleLoader  color="oklch(0.707 0.165 254.624)" />

      <div className="flex flex-col items-center justify-center">
        {percentage ? <pre className="capitalize text-xs text-blue-400 text-center font-bold font-serif">{percentage}%</pre>:''}
        <pre className="capitalize text-blue-400 text-center text-xs py-3 font-thin">{status}...</pre>
      </div>
    </div>
  );
};

export default Loader;
