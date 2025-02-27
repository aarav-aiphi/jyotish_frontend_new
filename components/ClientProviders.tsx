"use client";

import { useAppDispatch } from '@/redux/hooks';
import { fetchFilterOptions } from '@/redux/filterOptionsSlice';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store'; 
import AuthLoader from '@/components/AuthLoader';
import GlobalConnectingPopup from '@/components/GlobalConnectingPopup';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <AuthLoader>
        <GlobalConnectingPopup />
        {children}
      </AuthLoader>
    </Provider>
  );
}
