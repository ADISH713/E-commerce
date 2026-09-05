import axios from "axios";
import { data } from "react-router-dom";

const API_URL = 'http://localhost:3001/carts';

export const getCartByUserId = async (UserId) =>{
    const{data} = await axios.get(`${API_URL}?userId=${UserId}`);
    return data[0]||null;
}

export const createCart = async (UserId,items)=>{
    const {data} = await axios.post(API_URL,{UserId,items});
    return data;
}

export const updateCart = async (cartId,items) =>{
    const {data} = await axios.patch(`${API_URL}/${cartId}`,{items});
    return data;
};