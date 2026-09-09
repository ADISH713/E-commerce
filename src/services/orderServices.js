import axios from "axios";

const API_URL = "http://localhost:3001/orders";

export const createOrder = async (orderData) => {
    const { data } = await axios.post(API_URL, orderData);
    return data;
};
export const getOrdersByUserId = async (userId) => {
  const { data } = await axios.get(API_URL);

  return data.filter(
    (order) => String(order.userId) === String(userId)
  );
};