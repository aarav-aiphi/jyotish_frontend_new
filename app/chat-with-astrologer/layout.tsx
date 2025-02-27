"use client";

import { ReactNode, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectUser, fetchCurrentUser } from '@/redux/userSlice';
import { Loader } from '@/components/loader';
import { fetchFilterOptions } from '@/redux/filterOptionsSlice';
import { getCookie } from '@/lib/utils';

interface ProtectedLayoutProps {
  children: ReactNode;
}

// Child component that handles authentication logic
function AuthChecker() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = getCookie('token'); 

    // If no token exists, redirect to login immediately
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // If token exists but the user hasn't been loaded yet, fetch the current user
    if (!user) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          const queryString = searchParams ? `?${searchParams.toString()}` : '';
          const fullPath = `${pathname}${queryString}`;
          router.push('/auth/login?redirectUrl=' + encodeURIComponent(fullPath));
        });
    }
  }, [dispatch, user, router, pathname, searchParams]);

  // Dispatch filter options irrespective of the token as part of the authenticated context
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  return null;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = useAppSelector(selectUser);

  // While the user is not loaded, show a loader
  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <AuthChecker />
      </Suspense>
      {children}
    </>
  );
}
