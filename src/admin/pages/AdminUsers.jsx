import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setUsers,
    setLoading,
    setError,
    blockUser,
    unblockUser,
} from '../../redux/slices/userSlice';    
import {
    getUsers,
    updateUser,
} from '../../services/userServices';

function AdminUsers() {
    const dispatch = useDispatch();

    const {
        items: users,
        isLoading,
        error,
    } = useSelector((state) => state.users);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch(setLoading(true));

                const data = await getUsers();

                dispatch(setUsers(data));
            } catch (error) {
                dispatch(setError(error.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchUsers();
    }, [dispatch]);

    const handleBlock = async (userId) => {
        try {
            await updateUser(userId, {
                blocked: true,
            });

            dispatch(blockUser(userId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await updateUser(userId, {
                blocked: false,
            });

            dispatch(unblockUser(userId));
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">
                Users
            </h2>

            {users.length === 0 ? (
                <p className="text-gray-500">
                    No users found.
                </p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Name</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Role</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {user.name}
                                    </td>

                                    <td className="p-4">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        {user.role}
                                    </td>

                                    <td className="p-4">
                                        {user.blocked
                                            ? 'Blocked'
                                            : 'Active'}
                                    </td>

                                    <td className="p-4">
                                        {user.role === 'admin' ? (
                                            <span className="text-gray-400">
                                                Admin
                                            </span>
                                        ) : user.blocked ? (
                                            <button
                                                onClick={() =>
                                                    handleUnblock(user.id)
                                                }
                                                className="px-3 py-2 bg-green-600 text-white rounded"
                                            >
                                                Unblock
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleBlock(user.id)
                                                }
                                                className="px-3 py-2 bg-red-600 text-white rounded"
                                            >
                                                Block
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;