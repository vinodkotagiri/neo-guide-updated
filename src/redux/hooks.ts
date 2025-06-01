import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

/**
 * Custom hook to dispatch actions with type-safe AppDispatch.
 * @returns Typed dispatch function.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Custom hook to select state from the Redux store with type-safe RootState.
 * @returns Typed selector function.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;