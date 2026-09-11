import { createSlice } from '@reduxjs/toolkit';

const storedAuth = localStorage.getItem('user');
let parsedAuth = null;
try {
    parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
} catch {
    parsedAuth = null;
}

const authSlice = createSlice({ 
    name: 'auth',
    initialState: {
        user: parsedAuth ? {id: parsedAuth.userId,role: parsedAuth.role} : null,isAuthenticated: !!parsedAuth,},
    reducers: {
        setUser: (state, action) => {
            const user = action.payload;

            state.user = user;
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify({userId: user.id,role: user.role}));
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem('user');
        },
    },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;