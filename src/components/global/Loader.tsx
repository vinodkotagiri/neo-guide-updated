import { ScaleLoader } from 'react-spinners';
import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../../redux/hooks';
import type { LoaderState } from '../../redux/features/loaderSlice';

// Define valid loader status values
const LOADER_STATUSES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
} as const;

// Custom Tailwind color (should be added to tailwind.config.js)
const LOADER_COLOR = 'var(--loader, oklch(0.707 0.165 254.624))';

// Memoized selector for loader state
const selectLoader = createSelector(
  (state: { loader: LoaderState }) => state.loader,
  ({ loading, status, percentage }) => ({ loading, status, percentage }),
);

const Loader = () => {
  const { loading, status, percentage } = useAppSelector(selectLoader);

  if (!loading) return null;

  // Dynamic text color based on status
  const statusColorClass =
    status === LOADER_STATUSES.ERROR ? 'text-red-400' : 'text-blue-400';

  return (
    <div
      className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center gap-3 bg-black bg-opacity-90"
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-testid="loader"
    >
      <ScaleLoader color={LOADER_COLOR} aria-label="Loading spinner" />

      <div className="flex flex-col items-center justify-center gap-2">
        {percentage > 0 && (
          <span
            className={`text-center text-xs font-bold ${statusColorClass} capitalize font-serif`}
          >
            {percentage}%
          </span>
        )}
        <span
          className={`text-center text-xs font-light ${statusColorClass} capitalize`}
        >
          {status}...
        </span>
      </div>
    </div>
  );
};

export default Loader;