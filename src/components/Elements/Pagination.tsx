import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IconCaretsDown from '../../components/Icon/IconCaretsDown';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import { useTranslation } from 'react-i18next';


interface PaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage = 10,
    currentPage,
    onPageChange,
    maxVisiblePages = 5
}) => {

    // const { t } = useTranslation();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // اگر فقط یک صفحه داریم، پیجینیشن نشان نده
    if (totalPages <= 1) return null;

    const generatePageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // اگر نزدیک ابتدا هستیم
        if (currentPage <= halfVisible) {
            endPage = Math.min(totalPages, maxVisiblePages);
        }

        // اگر نزدیک انتها هستیم
        if (currentPage > totalPages - halfVisible) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        // اضافه کردن اولین صفحه
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // اضافه کردن صفحات میانی
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // اضافه کردن آخرین صفحه
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageChange = (page: number): void => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    const pages = generatePageNumbers();

    // const getPageRangeText = (): string => {
    //     const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    //     const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    //     return `${t("pagination", { total: totalItems, from: startItem, to: endItem })}`
    // };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* پیجینیشن اصلی */}
            <ul className="inline-flex items-center gap-1">
                {/* First Page */}
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="flex justify-center font-semibold rounded-s-full px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="صفحه اول"
                    >
                        <IconCaretsDown className="rotate-90 rtl:-rotate-90" />

                    </button>
                </li>

                {/* Previous Page */}
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="صفحه قبلی"
                    >
                        <IconCaretDown className="w-5 h-5 rotate-90 rtl:-rotate-90" />

                    </button>
                </li>

                {/* Page Numbers */}
                {pages.map((page, index) => (
                    <li key={index}>
                        {page === '...' ? (
                            <span
                                className="flex justify-center font-semibold px-3.5 py-2 bg-white-light text-dark dark:text-white-light dark:bg-[#191e3a] cursor-default"
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handlePageChange(page as number)}
                                className={`flex justify-center font-semibold px-3.5 py-2 transition ${currentPage === page
                                    ? 'bg-primary text-white dark:text-white-light dark:bg-primary'
                                    : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'
                                    }`}
                                aria-label={`صفحه ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next Page */}
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="صفحه بعدی"
                    >
                        <IconCaretDown className="w-5 h-5 -rotate-90 rtl:rotate-90" />

                    </button>
                </li>

                {/* Last Page */}
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="flex justify-center font-semibold rounded-e-full px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="آخرین صفحه"
                    >
                        <IconCaretsDown className="-rotate-90 rtl:rotate-90" />

                    </button>
                </li>
            </ul>

            {/* اطلاعات صفحه */}
            {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                {getPageRangeText()}
            </div> */}
        </div>
    );
};

// // مثال استفاده از کامپوننت
// export const PaginationExample: React.FC = () => {
//     const [currentPage, setCurrentPage] = React.useState<number>(1);
//     const totalItems = 156;
//     const itemsPerPage = 10;

//     const handlePageChange = (page: number): void => {
//         setCurrentPage(page);
//         console.log(`تغییر به صفحه: ${page}`);
//     };

//     return (
//         <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
//             <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">مثال پیجینیشن</h2>

//             <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
//                 <p className="text-gray-700 dark:text-gray-300">صفحه فعلی: {currentPage}</p>
//             </div>

//             <Pagination
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//                 maxVisiblePages={5}
//             />
//         </div>
//     );
// };

export default Pagination;