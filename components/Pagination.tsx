"use client";

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // For short paginations, you can just do:
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" aria-hidden="true" />
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-black text-white' : 'bg-gray-900'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
      >
        Next
        <ArrowRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
      </button>
    </div>
  );
}
