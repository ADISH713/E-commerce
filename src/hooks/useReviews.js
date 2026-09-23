import { useQuery } from "@tanstack/react-query";
import { getReviewsByProductId } from "../services/reviewServices";

export const useReviews = (productId) => {
    return useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => getReviewsByProductId(productId),
        enabled: !!productId,
    });
};