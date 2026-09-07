import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name : 'cart',
    initialState : {
        items:[],
        cartId : null
    },
    reducers :{
        setCart : (state,action)=>{
            state.cartId = action.payload.id ?? null;
            state.items = action.payload.items ?? [];
        },
        clearCartState : (state)=>{
            state.items = [];
            state.cartId = null;
        },
    },
});
export const {setCart,clearCartState} = cartSlice.actions;
export default cartSlice.reducer;