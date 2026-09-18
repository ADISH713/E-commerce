import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'products',

    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },

    reducers: {
        setProducts: (state, action) => {
            state.items = action.payload;
        },

        addProduct: (state, action) => {
            state.items.push(action.payload);
        },

        updateProduct: (state, action) => {
            const updatedProduct = action.payload;

            const index = state.items.findIndex(
                (product) => String(product.id) === String(updatedProduct.id)
            );

            if (index !== -1) {
                state.items[index] = updatedProduct;
            }
        },

        deleteProduct: (state, action) => {
            state.items = state.items.filter(
                (product) => String(product.id) !== String(action.payload)
            );
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
        softDeleteProduct: (state, action) => {
            const product = state.items.find(
                (product) =>
                    String(product.id) === String(action.payload)
            );

            if (product) {
                product.deleted = true;
            }
        },
        deleteProduct: (state, action) => {
            state.items = state.items.filter(
                (product) =>
                    String(product.id) !== String(action.payload)
            );
        },
        restoreProduct: (state, action) => {
            const product = state.items.find(
                (product) => String(product.id) === String(action.payload)
            );

            if (product) {
                product.deleted = false;
            }
        },
    },
});

export const {
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    softDeleteProduct,
    restoreProduct,
    setLoading,
    setError,
} = productSlice.actions;

export default productSlice.reducer;