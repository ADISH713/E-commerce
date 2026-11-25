import React from 'react';

function PageLoader({ label = 'Loading...' }) {
    return (
        <div className='flex flex-col items-center justify-center py-16 gap-3' role='status'>
            <div className='h-8 w-8 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin' />
            <p className='text-sm text-gray-500'>{label}</p>
        </div>
    );
}

export default PageLoader;