import { useSearchParams } from 'react-router-dom';

export const PAGE_SIZE = 9;

// reads the URL only; the server does the actual filtering
export const useProductFilters = () => {
    const [searchParams] = useSearchParams();

    const gradeFilter = searchParams.get('grade');
    const categoryFilter = searchParams.get('category');
    const searchFilter = searchParams.get('search');
    const sortFilter = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1);

    // undefined values are left out of the request
    const queryParams = {
        grade: gradeFilter || undefined,
        category: categoryFilter || undefined,
        search: searchFilter || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort: sortFilter || undefined,
        page,
        limit: PAGE_SIZE,
    };

    return {
        gradeFilter,
        categoryFilter,
        searchFilter,
        sortFilter,
        minPrice,
        maxPrice,
        page,
        queryParams,
        searchParams,
    };
};