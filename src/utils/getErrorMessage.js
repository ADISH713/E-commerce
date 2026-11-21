export const getErrorMessage = (error, fallback = 'Something went wrong') => {
    const data = error.response?.data;

    if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data[0].message;
    }

    return data?.message || fallback;
};