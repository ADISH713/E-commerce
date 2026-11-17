import api from './api';

const mapWishlist = (wishlist) => ({
    items: wishlist.products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        stock: product.stock,
    })),
    totalItems: wishlist.totalItems,
});

export const getWishlist = async () => {
    const { data } = await api.get('/wishlist');
    return mapWishlist(data.data);
};

export const addToWishlist = async (productId) => {
    const { data } = await api.post('/wishlist', { productId });
    return mapWishlist(data.data);
};

export const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return mapWishlist(data.data);
};