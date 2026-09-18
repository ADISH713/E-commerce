import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'users',

    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },

    reducers: {
        setUsers: (state, action) => {
            state.items = action.payload;
        },

        blockUser: (state, action) => {
            const user = state.items.find(
                (user) => String(user.id) === String(action.payload)
            );

            if (user) {
                user.blocked = true;
            }
        },

        unblockUser: (state, action) => {
            const user = state.items.find(
                (user) => String(user.id) === String(action.payload)
            );

            if (user) {
                user.blocked = false;
            }
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
    setUsers,
    blockUser,
    unblockUser,
    setLoading,
    setError,
} = userSlice.actions;

export default userSlice.reducer;