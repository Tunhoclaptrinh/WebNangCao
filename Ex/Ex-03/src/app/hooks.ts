import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store.ts';

// Hook useAppDispatch gắn sẵn kiểu AppDispatch của dự án
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook useAppSelector gắn sẵn kiểu RootState cho toàn bộ ứng dụng
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
