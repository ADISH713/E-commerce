import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProductReviews, getMyReviewStatus } from '../services/reviewServices';

export const useProductReviews = (productId, page) =>
    useQuery({
        queryKey: ['reviews', productId, { page }],
        queryFn: () => getProductReviews(productId, { page, limit: 5 }),
        placeholderData: keepPreviousData,
        enabled: Boolean(productId),
    });

// only runs for logged-in users
export const useMyReviewStatus = (productId, enabled) =>
    useQuery({
        queryKey: ['review-status', productId],
        queryFn: () => getMyReviewStatus(productId),
        enabled: Boolean(productId) && enabled,
    });