import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './types';
import type { UserState } from './userSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const token = useAppSelector((state: RootState) => state.user.token);
  const loading = useAppSelector((state: RootState) => state.user.loading);
  const error = useAppSelector((state: RootState) => state.user.error);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
  };
};

export const useAstrologers = () => {
  return useAppSelector((state: RootState) => ({
    astrologers: state.astrologerFilters.astrologers,
    loading: state.astrologerFilters.loading,
    totalPages: state.astrologerFilters.totalPages,
    currentPage: state.astrologerFilters.currentPage
  }));
};