import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name:"wishlist",
    initialState:{
        items:[],
        wishlistId : null
    },
    reducers:{
        setWishlist: (state,action)=>{
            state.wishlistId = action.payload.id??null;
            state.items = action.payload.items??[];
        },
        clearWishlistState : (state)=>{
            state.wishlistId = null;
            state.items = [];
        }
    }
});

export const{setWishlist,clearWishlistState} = wishlistSlice.actions;
export default wishlistSlice.reducer;