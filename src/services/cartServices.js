import axios from "axios";

const API_URL = 'http://localhost:3001/carts';

export const getCartByUserId = async (userId) => {
    const { data } = await axios.get(`${API_URL}?userId=${userId}`);
    return data[0] || null;
}

export const createCart = async (userId, items) => {
    const { data } = await axios.post(API_URL, { userId, items });
    return data;
}

export const updateCart = async (cartId, items) => {
    const { data } = await axios.patch(`${API_URL}/${cartId}`, { items });
    return data;
};