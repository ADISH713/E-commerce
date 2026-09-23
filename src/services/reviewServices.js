import axios from "axios";

const API_URL = "http://localhost:3001/reviews";

export const getReviewsByProductId = async (productId) => {
    const { data } = await axios.get(
        `${API_URL}?productId=${productId}`
    );

    return data;
};

export const createReview = async (reviewData) => {
    const { data } = await axios.post(
        API_URL,
        reviewData
    );

    return data;
};