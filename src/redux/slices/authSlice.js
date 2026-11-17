// import { createSlice } from '@reduxjs/toolkit';

// const storedAuth = localStorage.getItem('user');
// let parsedAuth = null;
// try {
//     parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
// } catch {
//     parsedAuth = null;
// }

// const authSlice = createSlice({ 
//     name: 'auth',
//     initialState: {
//         user: parsedAuth ? {id: parsedAuth.userId,role: parsedAuth.role} : null,isAuthenticated: !!parsedAuth,},
//     reducers: {
//         setUser: (state, action) => {
//             const user = action.payload;

//             state.user = user;
//             state.isAuthenticated = true;

//             localStorage.setItem('user', JSON.stringify({userId: user.id,role: user.role}));
//         },

//         logout: (state) => {
//             state.user = null;
//             state.isAuthenticated = false;

//             localStorage.removeItem('user');
//         },
//     },
// });

// export const { setUser, logout } = authSlice.actions;

// export default authSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

// the old version stored the user in localStorage, so clear that leftover key once
localStorage.removeItem('user');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },

        finishLoading: (state) => {
            state.isLoading = false;
        },
    },
});

export const { setUser, logout, finishLoading } = authSlice.actions;

export default authSlice.reducer;