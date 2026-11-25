import React from 'react';

// catches errors thrown while rendering, so one broken component cannot blank the whole app
class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled UI error:', error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50'>
                <h1 className='text-3xl font-semibold text-gray-900'>Something went wrong</h1>
                <p className='text-gray-500 mt-2 max-w-md'>
                    An unexpected error happened. Reloading the page usually fixes it.
                </p>

                <div className='flex gap-3 mt-6'>
                    <button
                        type='button'
                        onClick={() => window.location.reload()}
                        className='bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-orange-700 transition'
                    >
                        Reload page
                    </button>

                    <button
                        type='button'
                        onClick={() => {
                            window.location.href = '/';
                        }}
                        className='border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-100 transition'
                    >
                        Go to home
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;