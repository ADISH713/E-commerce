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
    },
});

export const {
    setOrders,
    setLoading,
    setError,
} = orderSlice.actions;

export default orderSlice.reducer;