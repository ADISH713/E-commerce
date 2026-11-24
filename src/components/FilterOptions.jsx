import React from 'react';
import { useNavigate } from 'react-router-dom';

// a list of options where one value of a URL param can be picked (value: null clears it)
function FilterOptions({ paramName, options, searchParams }) {
    const navigate = useNavigate();
    const current = searchParams.get(paramName);

    const select = (value) => {
        const params = new URLSearchParams(searchParams);

        params.delete('page');

        if (value) {
            params.set(paramName, value);
        } else {
            params.delete(paramName);
        }

        navigate(`/products?${params.toString()}`);
    };

    return (
        <div className='space-y-3'>
            {options.map(({ value, label }) => {
                const isActive = (current ?? null) === value;

                return (
                    <button
                        key={label}
                        type='button'
                        onClick={() => select(value)}
                        className={`block w-full text-left text-sm transition ${
                            isActive
                                ? 'text-orange-600 font-medium'
                                : 'text-gray-600 hover:text-orange-600'
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

export default FilterOptions;