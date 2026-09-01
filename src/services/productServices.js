import axios from 'axios'

const API_URL = "http://localhost:3001/products";

export const getProducts = async ()=>{
    const {data} = await axios.get(API_URL);
    return data;
};

export const getProductById = async (id) =>{
    const {data} = await axios.get(`${API_URL}/${id}`)
    return data;
};