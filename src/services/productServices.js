import axios from 'axios'
import api from './api'

const API_URL = "http://localhost:3001/products";

const mapProduct = (product) => ({
    ...product,
    id: product._id,
    deleted: !product.isActive,
});

export const getProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 1000 } });
    return data.data.products.map(mapProduct);
};

export const getProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return mapProduct(data.data);
};

export const createProduct = async (product) => {
    const { data } = await axios.post(API_URL, product);
    return data;
};

export const updateProduct = async (id, product) => {
    const { data } = await axios.patch(`${API_URL}/${id}`,product);
    return data;
};

export const softDeleteProduct = async (id) => {
    const { data } = await axios.patch(
        `${API_URL}/${id}`,
        { deleted: true }
    );

    return data;
};

export const permanentlyDeleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};