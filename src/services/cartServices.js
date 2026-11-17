// import axios from "axios";

// const API_URL = 'http://localhost:3001/carts';


// export const getCartByUserId = async (userId) => {
//     const { data } = await axios.get(API_URL);

//     const userCart = data.find(
//         (cart) => String(cart.userId) === String(userId)
//     );

//     return userCart || null;
// };

// export const createCart = async (userId, items) => {
//     const { data } = await axios.post(API_URL, { userId, items });
//     return data;
// }

// export const updateCart = async (cartId, items) => {
//     const { data } = await axios.patch(`${API_URL}/${cartId}`, { items });
//     return data;
// };

import api from './api';

const mapCart = (cart) => ({
    items: cart.items.map(({ product, quantity }) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        isActive: product.isActive,
        quantity,
    })),
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
});

export const getCart = async () => {
    const { data } = await api.get('/cart');
    return mapCart(data.data);
};

export const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    return mapCart(data.data);
};

export const updateCartItem = async (productId, quantity) => {
    const { data } = await api.patch(`/cart/${productId}`, { quantity });
    return mapCart(data.data);
};

export const removeCartItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    return mapCart(data.data);
};

export const clearCart = async () => {
    await api.delete('/cart');
    return { items: [], totalItems: 0, totalPrice: 0 };
};