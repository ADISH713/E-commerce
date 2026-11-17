import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
    accessToken = token;
};
export const clearAccessToken = () => {
    accessToken = null;
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let refreshPromise = null;

export const refreshSession = () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
            .then(({ data }) => {
                setAccessToken(data.data.accessToken);
                return data.data;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const isAuthRoute = original?.url?.startsWith("/auth/");

        if (error.response?.status !== 401 || original._retry || isAuthRoute) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            const { accessToken: newToken } = await refreshSession();
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
        } catch (refreshError) {
            clearAccessToken();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);
        }
    }
);

export default api;