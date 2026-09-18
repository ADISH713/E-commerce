import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        wishlist:wishlistReducer,
        products: productReducer,
        users: userReducer,
    },
});
export default store;