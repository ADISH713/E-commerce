import api from './api';

// the backend sends isBlocked and _id, the existing UI reads blocked and id
const mapUser = (user) => ({
    ...user,
    id: user._id,
    blocked: user.isBlocked,
});

// params: page, limit, status (all | active | blocked), role, search
export const getAdminUsers = async (params) => {
    const { data } = await api.get('/admin/users', { params });
    const { users, ...rest } = data.data;
    return { ...rest, users: users.map(mapUser) };
};

export const setUserBlocked = async (id, isBlocked) => {
    const { data } = await api.patch(`/admin/users/${id}/status`, { isBlocked });
    return mapUser(data.data);
};

// TEMPORARY: useAdminData still calls this for the dashboard.
// It goes away on Day 4 when the dashboard gets its own stats endpoint.
export const getUsers = async () => {
    const { users } = await getAdminUsers({ limit: 100 });
    return users;
};