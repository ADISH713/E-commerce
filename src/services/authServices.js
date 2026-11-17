import api, { setAccessToken, clearAccessToken } from "./api";

const getMessage = (error) => {
    const body = error.response?.data;

    if (Array.isArray(body?.data) && body.data.length > 0) {
        return body.data[0].message;
    }

    return body?.message || error.message;
};

export const loginUser = async (email, password) => {
    try {
        const { data } = await api.post("/auth/login", { email, password });
        setAccessToken(data.data.accessToken);
        return data.data.user;
    } catch (error) {
        throw new Error(getMessage(error));
    }
};

export const loginAdmin = async (email, password) => {
    try {
        const { data } = await api.post("/auth/admin/login", { email, password });
        setAccessToken(data.data.accessToken);
        return data.data.user;
    } catch (error) {
        throw new Error(getMessage(error));
    }
};

export const registerUser = async (newUser) => {
    try {
        const { data } = await api.post("/auth/register", newUser);
        return data.data;
    } catch (error) {
        throw new Error(getMessage(error));
    }
};

export const logoutUser = async () => {
    try {
        await api.post("/auth/logout");
    } catch {

    } finally {
        clearAccessToken();
    }
};