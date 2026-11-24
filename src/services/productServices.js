import api from './api';

const mapProduct = (product) => ({
    ...product,
    id: product._id,
    deleted: !product.isActive,
});

export const getProducts = async (params) => {
    const { data } = await api.get('/products', { params });
    const { products, ...rest } = data.data;
    return { ...rest, products: products.map(mapProduct) };
};
export const getProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return mapProduct(data.data);
};

export const getCategories = async () => {
    const { data } = await api.get('/products/categories');
    return data.data;
};

// admin: status = "active" | "trash" | "all", plus page, limit, category, search, sort
export const getAdminProducts = async (params) => {
    const { data } = await api.get('/admin/products', { params });
    const { products, ...rest } = data.data;
    return { ...rest, products: products.map(mapProduct) };
};

export const createProduct = async (product) => {
    const { data } = await api.post('/products', product);
    return mapProduct(data.data);
};

export const updateProduct = async (id, product) => {
    const { data } = await api.patch(`/products/${id}`, product);
    return mapProduct(data.data);
};

export const softDeleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
};

export const restoreProduct = async (id) => {
    const { data } = await api.patch(`/admin/products/${id}/restore`);
    return mapProduct(data.data);
};

export const permanentlyDeleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}/permanent`);
};