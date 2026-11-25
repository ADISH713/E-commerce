import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../admin/components/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';
import { getErrorMessage } from '../utils/getErrorMessage';
import CategoryFilter from '../components/CategoryFilter';
import FilterOptions from '../components/FilterOptions';
import PageLoader from '../components/PageLoader';
import ErrorState from '../components/ErrorState';

function Productlist() {

    const GRADE_OPTIONS = [
        { value: null, label: 'All grades' },
        { value: 'toy', label: 'Toy grade' },
        { value: 'hobby', label: 'Hobby grade' },
    ];

    const SORT_OPTIONS = [
        { value: null, label: 'Newest' },
        { value: 'price-low', label: 'Low to High' },
        { value: 'price-high', label: 'High to Low' },
    ];

    const rawNavigate = useNavigate();
    const [, setSearchParams] = useSearchParams();

    // every filter button calls this, so a filter change always starts again from page 1
    const navigate = (to) => {
        const [path, query = ''] = to.split('?');
        const params = new URLSearchParams(query);
        params.delete('page');
        const queryString = params.toString();
        rawNavigate(queryString ? `${path}?${queryString}` : path);
    };

    const {
        gradeFilter,
        categoryFilter,
        searchFilter,
        sortFilter,
        minPrice,
        maxPrice,
        page,
        queryParams,
        searchParams,
    } = useProductFilters();

    const { data, isLoading, isError, error, refetch } = useProducts(queryParams);

    const products = data?.products ?? [];
    const totalPages = data?.pages ?? 1;

    // a shared link can point past the last page, so step back to it
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) {
            setSearchParams(
                (prev) => {
                    const params = new URLSearchParams(prev);
                    params.set('page', String(data.pages));
                    return params;
                },
                { replace: true }
            );
        }
    }, [data, page, setSearchParams]);

    const goToPage = (target) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', String(target));
            return params;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return <PageLoader label='Loading products...' />;
    }

    if (isError) {
        return (
            <ErrorState
                error={error}
                onRetry={refetch}
                className='mx-4 sm:mx-6 lg:mx-12 my-6'
            />
        );
    }

    return (
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 py-5 sm:py-7 lg:py-8'>

            <h2 className='text-xl sm:text-2xl font-medium text-gray-900 mb-5 sm:mb-6 break-words'>
                {searchFilter
                    ? `Search results for "${searchFilter}"`
                    : categoryFilter
                    ? categoryFilter
                    : gradeFilter
                    ? `${gradeFilter === 'hobby' ? 'Hobby' : 'Toy'} grade cars`
                    : 'RC cars'}
            </h2>

            {/* MOBILE FILTERS */}
            <details className='md:hidden mb-5 border border-orange-200 rounded-lg overflow-hidden'>
                <summary className='list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center justify-between px-4 py-3'>
                    <span className='text-sm font-medium text-gray-900'>
                        Filters
                    </span>

                    <span className='text-sm text-orange-600 font-medium'>
                        Filter & Sort
                    </span>
                </summary>

                <div className='border-t border-orange-100 p-4 max-h-[60vh] overflow-y-auto scrollbar-none'>

                    {/* Clear all */}
                    {(gradeFilter || categoryFilter || sortFilter || searchFilter || minPrice || maxPrice) && (
                        <div className='flex justify-end mb-4'>
                            <button
                                type='button'
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);

                                    params.delete('grade');
                                    params.delete('category');
                                    params.delete('sort');
                                    params.delete('search');
                                    params.delete('minPrice');
                                    params.delete('maxPrice');

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='text-xs text-orange-600 hover:text-orange-700 font-medium'
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Grade */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Grade
                        </h4>

                        <CategoryFilter
                            searchParams={searchParams}
                            categoryFilter={categoryFilter}
                        />
                    </div>

                    {/* Category */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Category
                        </h4>
                        <CategoryFilter
                            searchParams={searchParams}
                            categoryFilter={categoryFilter}
                        />
                                                
                    </div>

                    {/* Price */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Price
                        </h4>

                        <div className='flex items-center gap-2'>

                            <input
                                type='number'
                                placeholder='Min'
                                value={minPrice || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);

                                    if (e.target.value) {
                                        params.set('minPrice', e.target.value);
                                    } else {
                                        params.delete('minPrice');
                                    }

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='w-full min-w-0 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500'
                            />

                            <span className='text-gray-400 shrink-0'>-</span>

                            <input
                                type='number'
                                placeholder='Max'
                                value={maxPrice || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);

                                    if (e.target.value) {
                                        params.set('maxPrice', e.target.value);
                                    } else {
                                        params.delete('maxPrice');
                                    }

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='w-full min-w-0 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500'
                            />

                        </div>
                    </div>

                    {/* PRICE SORT */}
                    <div className='border-t border-gray-200 pt-4'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Sort by price
                        </h4>

                        <CategoryFilter
                            searchParams={searchParams}
                            categoryFilter={categoryFilter}
                        />

                    </div>

                </div>
            </details>

            <div className='flex gap-5 lg:gap-8'>

                {/* DESKTOP FILTER SIDEBAR */}
                <aside className="hidden md:block w-52 lg:w-56 shrink-0 border border-orange-200 rounded-lg p-4 lg:p-5 h-fit sticky top-[110px] max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-none hover:border-orange-300">

                    <div className='flex items-center justify-between gap-2 mb-5'>

                        <h3 className='text-base lg:text-lg font-medium text-gray-900'>
                            Filters
                        </h3>

                        {(gradeFilter || categoryFilter || sortFilter || searchFilter || minPrice || maxPrice) && (
                            <button
                                type='button'
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);

                                    params.delete('grade');
                                    params.delete('category');
                                    params.delete('sort');
                                    params.delete('search');
                                    params.delete('minPrice');
                                    params.delete('maxPrice');

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='text-xs text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap'
                            >
                                Clear all
                            </button>
                        )}

                    </div>

                    {/* Grade */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Grade
                        </h4>

                        <FilterOptions
                            paramName='grade'
                            options={GRADE_OPTIONS}
                            searchParams={searchParams}
                        />
                        
                    </div>

                    {/* Category */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Category
                        </h4>

                        <CategoryFilter
                            searchParams={searchParams}
                            categoryFilter={categoryFilter}
                        />        
                    </div>

                    {/* Price */}
                    <div className='border-t border-gray-200 pt-4 mb-6'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Price
                        </h4>

                        <div className='flex items-center gap-2'>

                            <input
                                type='number'
                                placeholder='Min'
                                value={minPrice || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);

                                    if (e.target.value) {
                                        params.set('minPrice', e.target.value);
                                    } else {
                                        params.delete('minPrice');
                                    }

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='w-full min-w-0 border border-gray-200 rounded-md px-2 py-2 text-sm outline-none focus:border-orange-500'
                            />

                            <span className='text-gray-400 shrink-0'>-</span>

                            <input
                                type='number'
                                placeholder='Max'
                                value={maxPrice || ''}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);

                                    if (e.target.value) {
                                        params.set('maxPrice', e.target.value);
                                    } else {
                                        params.delete('maxPrice');
                                    }

                                    navigate(`/products?${params.toString()}`);
                                }}
                                className='w-full min-w-0 border border-gray-200 rounded-md px-2 py-2 text-sm outline-none focus:border-orange-500'
                            />

                        </div>
                    </div>

                    {/* PRICE SORT */}
                    <div className='border-t border-gray-200 pt-4'>

                        <h4 className='text-sm font-medium text-gray-900 mb-3'>
                            Sort by price
                        </h4>

                        <FilterOptions
                            paramName='sort'
                            options={SORT_OPTIONS}
                            searchParams={searchParams}
                        />
                    </div>

                </aside>

                {/* PRODUCTS */}
                <div className='flex-1 min-w-0'>

                    {products.length === 0 ? (
                        <p className='text-gray-500 text-sm'>
                            No cars matches
                        </p>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                        
                    )}
                                                <div className='mt-8'>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                goToPage={goToPage}
                                nextPage={() => page < totalPages && goToPage(page + 1)}
                                previousPage={() => page > 1 && goToPage(page - 1)}
                            />
                        </div>
                </div>

            </div>

        </div>
    );
}

export default Productlist;