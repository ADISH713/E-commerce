import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setOrders: (state, action) => {
            state.items = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;

            const order = state.items.find(
                (order) => String(order.id) === String(id)
            );

            if (order) {
                order.status = status;
            }
        },
    },
});

export const {
    setOrders,
    setLoading,
    setError,
    updateOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;