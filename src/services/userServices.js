import axios from "axios";

const API_URL = 'http://localhost:3001/users';

export const loginUser = async (email,password)=>{
    const {data} = await axios.get(
        `${API_URL}?email=${email}&password=${password}`
    );
    if(data.length === 0){
        throw new Error('Invalid email or password');
    }
    return data[0];
};
export const registerUser = async (newUser)=>{
    const{data:existing} = await axios.get (`${API_URL}?email=${newUser.email}`);
    if(existing.length > 0){
        throw new Error ('Email already registered');
    }
    const {data} = await axios.post(API_URL,{...newUser,role:'user'});
    return data;
};