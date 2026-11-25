import api, { setAccessToken, clearAccessToken } from "./api";
import { getErrorMessage } from "../utils/getErrorMessage";

export const loginUser = async (email, password) => {
    try {
        const { data } = await api.post("/auth/login", { email, password });
        setAccessToken(data.data.accessToken);
        return data.data.user;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const loginAdmin = async (email, password) => {
    try {
        const { data } = await api.post("/auth/admin/login", { email, password });
        setAccessToken(data.data.accessToken);
        return data.data.user;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const registerUser = async (newUser) => {
    try {
        const { data } = await api.post("/auth/register", newUser);
        return data.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const { data } = await api.post("/auth/verify-otp", { email, otp });
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const resendOtp = async (email) => {
    try {
        const { data } = await api.post("/auth/resend-otp", { email });
        return data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
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