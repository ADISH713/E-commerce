import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const usePagination = (items, itemsPerPage = 5) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const totalPages = Math.ceil(
        items.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedItems = items.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setSearchParams((prev) => {
                prev.set("page", String(totalPages));
                return prev;
            });
        }
    }, [
        currentPage,
        totalPages,
        setSearchParams,
    ]);

    const goToPage = (page) => {
        setSearchParams((prev) => {
            prev.set("page", String(page));
            return prev;
        });
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    return {
        currentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        previousPage,
    };
};