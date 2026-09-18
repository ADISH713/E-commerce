import axios from "axios";

const API_URL = 'http://localhost:3001/users';

export const loginUser = async (email, password) => {
    const { data } = await axios.get(
        `${API_URL}?email=${email}&password=${password}`
    );

    if (data.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = data[0];

    if (user.blocked) {
        throw new Error('Your account has been blocked.');
    }

    return user;
};

export const getUserById = async (userId) => {
    try {
        const { data } = await axios.get(`${API_URL}/${userId}`);
        return data;
    } catch (err) {
        if (err.response?.status === 404) {
            throw new Error('User not found');
        }
        throw err;
    }
};

export const getUsers = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const updateUser = async (id, user) => {
    const { data } = await axios.patch(
        `${API_URL}/${id}`,
        user
    );
    return data;
};

export const registerUser = async (newUser) => {
    const { data: existing } = await axios.get(`${API_URL}?email=${newUser.email}`);

    if (existing.length > 0) {
        throw new Error('Email already registered');
    }

    const { data } = await axios.post(API_URL,{...newUser,role: 'user'});

    return data;
};