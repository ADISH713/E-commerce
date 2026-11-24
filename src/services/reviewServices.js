import api from './api';

// params: page, limit. Returns { reviews, total, page, pages, summary }
export const getProductReviews = async (productId, params) => {
    const { data } = await api.get(`/products/${productId}/reviews`, { params });
    return data.data;
};

// { hasPurchased, canReview, myReview } for the logged-in user
export const getMyReviewStatus = async (productId) => {
    const { data } = await api.get(`/products/${productId}/reviews/me`);
    return data.data;
};

export const createReview = async (productId, { rating, comment }) => {
    const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
    return data.data;
};

export const updateReview = async (reviewId, changes) => {
    const { data } = await api.patch(`/reviews/${reviewId}`, changes);
    return data.data;
};

export const deleteReview = async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
};

// params: page, limit, search, rating, sort
export const getAdminReviews = async (params) => {
    const { data } = await api.get('/admin/reviews', { params });
    return data.data; // { reviews, total, page, pages, ratingCounts }
};