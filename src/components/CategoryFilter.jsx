import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

function CategoryFilter({ searchParams, categoryFilter }) {
    const navigate = useNavigate();
    const { data: categories = [] } = useCategories();

    const selectCategory = (category) => {
        const params = new URLSearchParams(searchParams);
        params.delete('page');

        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        navigate(`/products?${params.toString()}`);
    };

    const itemClass = (isActive) =>
        `block w-full text-left text-sm transition ${
            isActive
                ? 'text-orange-600 font-medium'
                : 'text-gray-600 hover:text-orange-600'
        }`;

    return (
        <div className='space-y-3'>
            <button
                type='button'
                onClick={() => selectCategory(null)}
                className={itemClass(!categoryFilter)}
            >
                All categories
            </button>

            {categories.map((category) => (
                <button
                    key={category}
                    type='button'
                    onClick={() => selectCategory(category)}
                    className={itemClass(categoryFilter === category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;