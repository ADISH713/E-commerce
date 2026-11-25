export const getErrorMessage = (error, fallback = 'Something went wrong') => {
    // no response at all means the server could not be reached
    if (error?.request && !error?.response) {
        return 'Cannot reach the server. Please check your connection and try again.';
    }

    const data = error?.response?.data;

    if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data[0].message;
    }

    return data?.message || fallback;
};