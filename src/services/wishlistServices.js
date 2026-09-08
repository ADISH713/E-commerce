import axios from "axios";

const API_URL = 'http://localhost:3001/wishlists';

export const getWishlistByUserId = async (userId)=>{
    const {data} = await axios.get(API_URL);

    const userWishlist = data.find((wishlist)=>String(wishlist.userId) === String(userId));
    return userWishlist || null;
};

export const createWishlist = async(userId,items)=>{
    const {data} = await axios.post(API_URL,{userId,items});
    return data;
};

export const updateWishlist = async (wishlistId, items)=>{
    const {data} = await axios.patch(`${API_URL}/${wishlistId}`,{items});
    return data;
};
