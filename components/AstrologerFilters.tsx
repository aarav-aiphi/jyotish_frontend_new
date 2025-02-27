"use client";

import { useEffect, Fragment } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setMinRating,
  setPage,
  setVerified,
  setStatus,
  setSpecializations,
  setLanguages,
  setMinExperience,
  setMaxCost,
  resetFilters
} from '@/redux/astrologerFilterSlice';
import { fetchFilterOptions } from '@/redux/filterOptionsSlice';
import { useDebouncedCallback } from 'use-debounce';

interface AstrologerFiltersProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}

const statusOptions = [
  { name: 'Online Now', value: 'online' },
  { name: 'Verified Only', value: 'verified' },
];

interface RatingOption {
  value: number;
  label: string;
}

const ratingOptions: RatingOption[] = [
  { value: 4, label: '4+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 2, label: '2+ Stars' },
  { value: 1, label: '1+ Stars' },
];

interface RadioOption {
  value: number;
  label: string;
}

interface CheckboxOption {
  value: string;
  label: string;
}

interface FilterSection {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'range';
  options?: RadioOption[] | CheckboxOption[];
  min?: number;
  max?: number;
}

export default function AstrologerFilters({
  mobileFiltersOpen,
  setMobileFiltersOpen
}: AstrologerFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.astrologerFilters);
  const filterOptions = useAppSelector((state) => state.filterOptions);
  const { languages, specializations, minCost, maxCost, minExperience, maxExperience } = filterOptions;


  const debouncedExperience = useDebouncedCallback((value: number) => {
    dispatch(setMinExperience(value));
  }, 300);

  const debouncedMaxCost = useDebouncedCallback((value: number) => {
    dispatch(setMaxCost(value));
  }, 300);

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);


  const handleStatusSelection = (optionValue: string) => {
    if (optionValue === 'online') {
      dispatch(setStatus(filters.status === 'online' ? '' : 'online'));
    } else if (optionValue === 'verified') {
      dispatch(setVerified(!filters.verified));
    }
    dispatch(setPage(1));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setMinRating(rating));
    dispatch(setPage(1)); 
  };

  const handleSpecializationChange = (value: string) => {
    const current = new Set(filters.specialization);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    dispatch(setSpecializations(Array.from(current)));
  };

  const handleLanguageChange = (value: string) => {
    const current = new Set(filters.language);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    dispatch(setLanguages(Array.from(current)));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedExperience(Number(e.target.value));
  };

  const handleMaxCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedMaxCost(Number(e.target.value));
  };
  useEffect(() => {
    return () => {
      debouncedExperience.cancel();
      debouncedMaxCost.cancel();
    };
  }, [debouncedExperience, debouncedMaxCost]);

  const filterSections: FilterSection[] = [
    {
      id: 'rating',
      name: 'Minimum Rating',
      type: 'radio',
      options: ratingOptions as RadioOption[],
    },
    {
      id: 'experience',
      name: 'Experience (Years)',
      type: 'range',
      min: minExperience,
      max: maxExperience,
    },
    {
      id: 'cost',
      name: 'Max Cost (₹/min)',
      type: 'range',
      min: minCost,
      max: maxCost,
    },
    {
      id: 'specialization',
      name: 'Specialization',
      type: 'checkbox',
      options: specializations.map(spec => ({ value: spec._id, label: spec.name })) as CheckboxOption[],
    },
    {
      id: 'language',
      name: 'Languages',
      type: 'checkbox',
      options: languages.map(lang => ({ value: lang, label: lang })) as CheckboxOption[],
    },
  ];

  return (
    <div className="bg-white">
      {/* MOBILE FILTERS (Dialog) */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as="div"
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-black/25"
          />

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as="div" 
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
              className="w-full" 
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex items-center p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filter content */}
                <div className="mt-4 border-t border-gray-200 px-4 py-6 space-y-4">
                  {/* Reset button */}
                  <button
                    onClick={() => {
                      dispatch(resetFilters());
                      setMobileFiltersOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset All Filters
                  </button>

                  {/* Status/Verification */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                    <div className="space-y-2">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            handleStatusSelection(opt.value);
                            setMobileFiltersOpen(false);
                          }}
                          className={classNames(
                            (opt.value === 'online' && filters.status === 'online') ||
                              (opt.value === 'verified' && filters.verified)
                              ? 'bg-indigo-100 text-indigo-800 font-medium'
                              : 'hover:bg-gray-100',
                            'block w-full text-left px-2 py-2 text-sm'
                          )}
                        >
                          {opt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Filter Sections */}
                  {filterSections.map(section => (
                    <div key={section.id} className="border-t border-gray-200 pt-4">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-left text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">{section.name}</span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                )}
                              </span>
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-4 px-2">
                              {section.type === 'radio' && section.options && (
                                <div className="space-y-3">
                                  {section.options.map((option) => (
                                    <div key={option.value} className="flex items-center">
                                      <input
                                        id={`mobile-${section.id}-${option.value}`}
                                        name={section.id}
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 rounded"
                                        checked={filters.minRating === option.value}
                                        onChange={() => {
                                          if (typeof option.value === 'number') {
                                            handleRatingChange(option.value);
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`mobile-${section.id}-${option.value}`}
                                        className="ml-3 text-sm text-gray-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {section.type === 'checkbox' && section.options && (
                                <div className="space-y-3">
                                  {section.options.map((option) => {
                                    const isChecked =
                                      section.id === 'specialization'
                                        ? filters.specialization.includes(String(option.value))
                                        : filters.language.includes(String(option.value));

                                    const handleChange = () => {
                                      if (section.id === 'specialization') {
                                        handleSpecializationChange(String(option.value));
                                      } else {
                                        handleLanguageChange(String(option.value));
                                      }
                                    };

                                    return (
                                      <div key={option.value} className="flex items-center">
                                        <input
                                          id={`mobile-${section.id}-${option.value}`}
                                          name={section.id}
                                          type="checkbox"
                                          className="h-4 w-4 border-gray-300 rounded"
                                          checked={isChecked}
                                          onChange={handleChange}
                                        />
                                        <label
                                          htmlFor={`mobile-${section.id}-${option.value}`}
                                          className="ml-3 text-sm text-gray-600"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {section.type === 'range' && (
                                <div className="mt-2">
                                  <input
                                    type="range"
                                    min={section.min}
                                    max={section.max}
                                    value={
                                      section.id === 'experience'
                                        ? filters.minExperience
                                        : filters.maxCost
                                    }
                                    onChange={
                                      section.id === 'experience'
                                        ? handleExperienceChange
                                        : handleMaxCostChange
                                    }
                                    className="w-full"
                                  />
                                  <div className="flex justify-between text-sm mt-1 text-gray-500">
                                    {section.id === 'experience' ? (
                                      <span>{filters.minExperience} yrs</span>
                                    ) : (
                                      <span>₹{filters.maxCost}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* DESKTOP FILTERS */}
      <aside className="hidden lg:block mt-6">
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-sm mb-4 text-blue-600 hover:text-blue-800"
        >
          Reset All Filters
        </button>

        {/* Status / Verification */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-md font-medium">Status</h3>
          <ul className="space-y-2 mt-2">
            {statusOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleStatusSelection(opt.value)}
                  className={classNames(
                    (opt.value === 'online' && filters.status === 'online') ||
                      (opt.value === 'verified' && filters.verified)
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'hover:bg-gray-100',
                    'block w-full text-left px-2 py-1 text-sm rounded'
                  )}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Filter Sections */}
        {filterSections.map(section => (
          <Disclosure
            as="div"
            key={section.id}
            className="border-b border-gray-200 py-4"
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4">
                  {/* Radio: Rating */}
                  {section.type === 'radio' && section.options && (
                    <div className="space-y-3">
                      {section.options.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            id={`filter-rating-${option.value}`}
                            name={section.id}
                            className="h-4 w-4 border-gray-300 rounded"
                            checked={filters.minRating === option.value}
                            onChange={() => {
                              if (typeof option.value === 'number') {
                                handleRatingChange(option.value);
                              }
                            }}
                          />
                          <label
                            htmlFor={`filter-rating-${option.value}`}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Checkboxes: Specialization/Languages */}
                  {section.type === 'checkbox' && section.options && (
                    <div className="space-y-3">
                      {section.options.map((option) => {
                        const isChecked =
                          section.id === 'specialization'
                            ? filters.specialization.includes(String(option.value))
                            : filters.language.includes(String(option.value));

                        const handleChange = () => {
                          if (section.id === 'specialization') {
                            handleSpecializationChange(String(option.value));
                          } else {
                            handleLanguageChange(String(option.value));
                          }
                        };

                        return (
                          <div key={option.value} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`filter-${section.id}-${option.value}`}
                              className="h-4 w-4 border-gray-300 rounded"
                              checked={isChecked}
                              onChange={handleChange}
                            />
                            <label
                              htmlFor={`filter-${section.id}-${option.value}`}
                              className="ml-2 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Range: Experience / Cost */}
                  {section.type === 'range' && (
                    <div className="mt-2">
                      {section.id === 'experience' && (
                        <>
                          <input
                            type="range"
                            min={section.min}
                            max={section.max}
                            value={filters.minExperience}
                            onChange={handleExperienceChange}
                            className="w-full"
                          />
                          <div className="text-sm mt-1 text-gray-500">
                            {filters.minExperience}+ years
                          </div>
                        </>
                      )}
                      {section.id === 'cost' && (
                        <>
                          <input
                            type="range"
                            min={section.min}
                            max={section.max}
                            value={filters.maxCost}
                            onChange={handleMaxCostChange}
                            className="w-full"
                          />
                          <div className="text-sm mt-1 text-gray-500">
                            Up to ₹{filters.maxCost} / min
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </aside>
    </div>
  );
}
