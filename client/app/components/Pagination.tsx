'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


interface PaginationProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export default function Pagination({ totalPages, currentPage, baseUrl }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const createPageUrl = (page: number) => {
    let url = '';
    if (baseUrl.includes('?')) {
      if (baseUrl.includes('page=')) {
        url = baseUrl.replace(/page=\d+/, `page=${page}`);
      } else {
        url = `${baseUrl}&page=${page}`;
      }
    } else {
      url = `${baseUrl}?page=${page}`;
    }
    router.push(url, { scroll: false });
  };

  if (totalPages <= 1) {
    return null;
  }

  // return (
  //   <div className="flex justify-center my-8">
  //     <nav className="flex items-center space-x-1">
  //       {currentPage > 1 ? (
  //         <Link
  //           href={createPageUrl(currentPage - 1)}
  //           className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
  //         >
  //           <span className="sr-only">Previous</span>
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  //           </svg>
  //         </Link>
  //       ) : (
  //         <span className="px-3 py-2 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed">
  //           <span className="sr-only">Previous</span>
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  //           </svg>
  //         </span>
  //       )}

  //       {getPageNumbers().map((page, index) => (
  //         page === '...' ? (
  //           <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
  //             ...
  //           </span>
  //         ) : (
  //           <Link
  //             key={`page-${page}`}
  //             href={createPageUrl(page as number)}
  //             className={`px-3 py-2 rounded-md ${currentPage === page
  //                 ? 'bg-blue-600 text-white font-medium'
  //                 : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
  //               }`}
  //           >
  //             {page}
  //           </Link>
  //         )
  //       ))}

  //       {currentPage < totalPages ? (
  //         <Link
  //           href={createPageUrl(currentPage + 1)}
  //           className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
  //         >
  //           <span className="sr-only">Next</span>
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  //           </svg>
  //         </Link>
  //       ) : (
  //         <span className="px-3 py-2 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed">
  //           <span className="sr-only">Next</span>
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  //             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  //           </svg>
  //         </span>
  //       )}
  //     </nav>
  //   </div>
  // );
  return (
    <div className="flex justify-center my-8">
      <nav className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => createPageUrl(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md ${currentPage === 1
              ? 'bg-white text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
        >
          <span className="sr-only">Previous</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => createPageUrl(page as number)}
              className={`px-3 py-2 rounded-md ${currentPage === page
                  ? 'bg-[#10375C] text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => createPageUrl(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md ${currentPage === totalPages
              ? 'bg-white text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
        >
          <span className="sr-only">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );

} 