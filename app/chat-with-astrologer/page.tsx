"use client";

import { Suspense, useState, Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import AstrologerCard from '@/components/ui/AstrologerCard';
import AstrologerFilters from '@/components/AstrologerFilters';
import Pagination from '@/components/Pagination';
import { useAstrologers } from '@/hooks/useAstrologers';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import classNames from 'classnames';
import {
  setPage,
  setSort,
  setSearch,
  setMinRating,
  setSpecializations,
  setLanguages,
  setMinExperience,
  setMaxCost,
  setStatus,
  setVerified,
} from '@/redux/astrologerFilterSlice';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const sortOptions = [
  { name: 'Best Rating', value: 'rating' },
  { name: 'Most Experienced', value: 'experience' },
  { name: 'Price: Low to High', value: 'cost' },
  { name: 'Most Consultations', value: 'consultations' },
];

export default function AstrologerListing() {
  const { astrologers, loading, totalPages, currentPage } = useAstrologers();
  const dispatch = useAppDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useAppSelector((state) => state.astrologerFilters);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    dispatch(setSearch(value));
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams();
  
    if (filters.search) params.set('search', filters.search);
    if (filters.sort !== 'rating') params.set('sort', filters.sort);
    if (filters.minRating > 0) params.set('minRating', filters.minRating.toString());
    if (filters.specialization.length > 0) params.set('specialization', filters.specialization.join(','));
    if (filters.language.length > 0) params.set('language', filters.language.join(','));
    if (filters.minExperience > 0) params.set('minExperience', filters.minExperience.toString());
    if (filters.maxCost < 500) params.set('maxCost', filters.maxCost.toString());
    if (filters.status) params.set('status', filters.status);
    if (filters.verified) params.set('verified', 'true');
    if (filters.page > 1) params.set('page', filters.page.toString());
  
    const queryString = params.toString();
    if (queryString) {
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.replace(pathname);
    }
  }, [filters, router, pathname]);

  // Parse URL params into Redux state
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'rating';
    const currentMinRating = Math.max(0, Number(searchParams.get('minRating')) || 0);
    const currentSpecialization = searchParams.get('specialization')?.split(',') || [];
    const currentLanguage = searchParams.get('language')?.split(',') || [];
    const currentMinExperience = Math.max(0, Number(searchParams.get('minExperience')) || 0);
    const currentMaxCost = Math.min(500, Math.max(0, Number(searchParams.get('maxCost')) || 500));
    const currentStatus = searchParams.get('status') || '';
    const currentVerified = searchParams.get('verified') === 'true';
    const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

    dispatch(setSearch(currentSearch));
    dispatch(setSort(currentSort));
    dispatch(setMinRating(currentMinRating));
    dispatch(setSpecializations(currentSpecialization));
    dispatch(setLanguages(currentLanguage));
    dispatch(setMinExperience(currentMinExperience));
    dispatch(setMaxCost(currentMaxCost));
    dispatch(setStatus(currentStatus));
    dispatch(setVerified(currentVerified));
    dispatch(setPage(currentPage));
  }, [dispatch, searchParams]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleSortChange = (sortValue: string) => {
    dispatch(setSort(sortValue));
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-[99%] overflow-hidden px-4 sm:px-6 lg:pl-4">
          {/* Page Header */}
          <div className="w-full flex items-baseline justify-between border-b border-gray-200">
            <div className='hidden lg:block'>
              <p className="text-2xl font-bold tracking-tight text-gray-900">/ Astrologers</p>
            </div>
            {/* Search Bar */}
            <div className="my-4 w-full max-w-[60%] lg:max-w-3xl">
              <input
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                type="text"
                placeholder="Search astrologers..."
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              {/* Sort Menu */}
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort By
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as="div"
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <button
                              onClick={() => handleSortChange(option.value)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700'
                              )}
                            >
                              {option.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
              >
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:flex">
            {/* Desktop Filters */}
            <div className="hidden lg:block lg:w-[20%] lg:mr-4">
              <AstrologerFilters
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />
            </div>
            {/* Main Content */}
            <div className="w-full lg:w-[80%]">
              {/* Mobile Filters */}
              <div className="lg:hidden mb-4">
                <AstrologerFilters
                  mobileFiltersOpen={mobileFiltersOpen}
                  setMobileFiltersOpen={setMobileFiltersOpen}
                />
              </div>

              {loading ? (
                <Loader />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.isArray(astrologers) && astrologers.length > 0 ? (
                      astrologers.map((astrologer) => (
                        <AstrologerCard key={astrologer._id} astrologer={astrologer} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center col-span-full">No astrologers found matching your criteria.</p>
                    )}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}