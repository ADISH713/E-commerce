import React from 'react'
import ProductCard from '../components/ProductCard';
import {useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';

function Productlist() {
    const navigate = useNavigate();

    const { data:products = [],isLoading,isError,error } = useProducts();

    const {
      filteredProducts,
      gradeFilter,
      categoryFilter,
      searchFilter,
      sortFilter,
      minPrice,
      maxPrice,
      searchParams,
    } = useProductFilters(products);

    
    if(isLoading) return <p className='px-5 sm:px-8 lg:px-12 py-6'>Loading...</p>;
    if(isError) return <p className='px-5 sm:px-8 lg:px-12 py-6 text-red-600'>Error:{error.message}</p>
    return (
  <div className='px-5 sm:px-8 lg:px-12 py-6 sm:py-8'>

    <h2 className='text-xl sm:text-2xl font-medium text-gray-900 mb-6'>
      {searchFilter
        ? `Search results for "${searchFilter}"`
        : categoryFilter
        ? categoryFilter
        : gradeFilter
        ? `${gradeFilter === 'hobby' ? 'Hobby' : 'Toy'} grade cars`
        : 'RC cars'}
    </h2>

        <div className='flex gap-8'>

        {/* FILTER SIDEBAR */}
        <aside className="hidden md:block w-56 shrink-0 border border-orange-200 rounded-lg p-5 h-fit sticky top-[110px] max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-none hover:border-orange-300">
        <div className='flex items-center justify-between mb-5'>
        <h3 className='text-lg font-medium text-gray-900'>
            Filters
        </h3>

        {(gradeFilter || categoryFilter || sortFilter || searchFilter|| minPrice || maxPrice) && (
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
        )}
        </div>
        {/* Grade */}
        <div className='border-t border-gray-200 pt-4 mb-6'>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Grade
          </h4>

          <div className='space-y-3'>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('grade');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              All grades
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('grade', 'toy');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Toy grade
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('grade', 'hobby');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Hobby grade
            </button>

          </div>
        </div>


        {/* Category */}
        <div className='border-t border-gray-200 pt-4 mb-6'>

          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Category
          </h4>

          <div className='space-y-3'>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('category');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              All categories
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('category', 'Off-Road Buggy');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Off-Road Buggy
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('category', 'Drift car');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Drift Car
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('category', 'Monster Truck');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Monster Truck
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('category', 'Rock Crawler');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Rock Crawler
            </button>

          </div>
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
        className='w-full border border-gray-200 rounded-md px-2 py-2 text-sm'
        />

        <span className='text-gray-400'>-</span>

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
        className='w-full border border-gray-200 rounded-md px-2 py-2 text-sm'
        />

    </div>

    </div>
        {/* PRICE SORT */}
        <div className='border-t border-gray-200 pt-4'>

          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Sort by price
          </h4>

          <div className='space-y-3'>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', 'price-low');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              Low to High
            </button>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', 'price-high');
                navigate(`/products?${params.toString()}`);
              }}
              className='block text-sm text-gray-600 hover:text-orange-600'
            >
              High to Low
            </button>

          </div>

        </div>

      </aside>


      {/* PRODUCTS */}
      <div className='flex-1'>

        {filteredProducts.length === 0 ? (
          <p className='text-gray-500 text-sm'>
            No cars matches
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </div>

    </div>

  </div>
)
}
export default Productlist
