import axios from "axios";

const API_URL = "http://localhost:3001/orders";

export const createOrder = async (orderData) => {
    const { data } = await axios.post(API_URL, orderData);
    return data;
};