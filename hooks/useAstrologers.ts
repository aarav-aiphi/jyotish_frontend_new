"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAstrologers } from '@/redux/astrologerFilterSlice';

export const useAstrologers = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.astrologerFilters);
  const { astrologers, loading, totalPages, currentPage, search, sort, minRating, specialization, language, minExperience, maxCost, status, verified, page, limit } = useAppSelector(
    (state) => state.astrologerFilters
  );

  useEffect(() => {
    dispatch(fetchAstrologers());
  }, [dispatch, search, sort, minRating, specialization, language, minExperience, maxCost, status, verified, page, limit]); 

  return {
    astrologers,
    loading,
    totalPages,
    currentPage,
  };
};