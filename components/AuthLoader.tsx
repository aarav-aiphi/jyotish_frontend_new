"use client";

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { fetchCurrentUser } from '@/redux/userSlice';

const AuthLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthLoader;
