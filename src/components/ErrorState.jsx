import React from 'react';
import { getErrorMessage } from '../utils/getErrorMessage';

function ErrorState({ error, onRetry, className = '' }) {
    return (
        <div
            role='alert'
            className={`bg-red-50 border border-red-100 rounded-xl p-4 sm:p-5 ${className}`}
        >
            <p className='text-sm text-red-600 break-words'>{getErrorMessage(error)}</p>

            {onRetry && (
                <button
                    type='button'
                    onClick={() => onRetry()}
                    className='mt-3 text-sm font-medium text-orange-600 hover:text-orange-700'
                >
                    Try again
                </button>
            )}
        </div>
    );
}

export default ErrorState;