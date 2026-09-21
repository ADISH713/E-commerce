import React from 'react';

function Pagination({
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 p-4 border-t">
            <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
            >
                Previous
            </button>

            {Array.from(
                { length: totalPages },
                (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => goToPage(index + 1)}
                        className={`px-3 py-2 border rounded ${
                            currentPage === index + 1
                                ? 'bg-orange-600 text-white'
                                : 'bg-white'
                        }`}
                    >
                        {index + 1}
                    </button>
                )
            )}

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;