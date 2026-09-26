import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, unblockUser } from '../../redux/slices/userSlice';
import { updateUser } from '../../services/userServices';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../components/Pagination';

function AdminUsers() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';

    const {
        items: users,
        isLoading,
        error,
    } = useSelector((state) => state.users);

    const filteredUser = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all'
                ? true
                : statusFilter === 'active'
                ? !user.blocked
                : user.blocked;

        return matchesSearch && matchesStatus;
    });

    const {
        currentPage,
        totalPages,
        paginatedItems: paginatedUsers,
        goToPage,
        nextPage,
        previousPage,
    } = usePagination(filteredUser, 5);

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
        return (
            <p className="text-sm text-gray-500">
                Loading users...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-red-600">
                Error: {error}
            </p>
        );
    }

    return (
        <div className="w-full min-w-0">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">

                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Users
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage registered TORQUE users
                    </p>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);

                            if (e.target.value) {
                                params.set('search', e.target.value);
                            } else {
                                params.delete('search');
                            }

                            params.set('page', '1');

                            setSearchParams(params);
                        }}
                        className="w-full sm:w-64 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);

                            if (e.target.value === 'all') {
                                params.delete('status');
                            } else {
                                params.set('status', e.target.value);
                            }

                            params.set('page', '1');

                            setSearchParams(params);
                        }}
                        className="w-full sm:w-auto border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="blocked">Blocked Users</option>
                    </select>

                </div>
            </div>

            {/* Empty state */}
            {filteredUser.length === 0 ? (

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-12 text-center">

                    <p className="text-sm text-gray-500">
                        No users found.
                    </p>

                </div>

            ) : (

                /* Users table */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="overflow-x-auto scrollbar-none">

                        <table className="w-full min-w-[700px] text-sm">

                            <thead>

                                <tr className="bg-gray-50 border-b border-gray-100 text-left">

                                    <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                        Name
                                    </th>

                                    <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                        Role
                                    </th>

                                    <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-4 sm:px-6 py-3.5 font-medium text-gray-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {paginatedUsers.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 last:border-b-0 hover:bg-orange-50/40 transition"
                                    >

                                        {/* Name */}
                                        <td className="px-4 sm:px-6 py-4">

                                            <p className="font-medium text-gray-900">
                                                {user.name}
                                            </p>

                                        </td>

                                        {/* Email */}
                                        <td className="px-4 sm:px-6 py-4">

                                            <p className="text-gray-500">
                                                {user.email}
                                            </p>

                                        </td>

                                        {/* Role */}
                                        <td className="px-4 sm:px-6 py-4">

                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-orange-50 text-orange-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {user.role}
                                            </span>

                                        </td>

                                        {/* Status */}
                                        <td className="px-4 sm:px-6 py-4">

                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    user.blocked
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-green-50 text-green-600'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                        user.blocked
                                                            ? 'bg-red-500'
                                                            : 'bg-green-500'
                                                    }`}
                                                />

                                                {user.blocked
                                                    ? 'Blocked'
                                                    : 'Active'}
                                            </span>

                                        </td>

                                        {/* Action */}
                                        <td className="px-4 sm:px-6 py-4">

                                            {user.role === 'admin' ? (

                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 text-xs font-medium">
                                                    Admin
                                                </span>

                                            ) : user.blocked ? (

                                                <button
                                                    onClick={() =>
                                                        handleUnblock(user.id)
                                                    }
                                                    className="px-3.5 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 active:bg-green-800 transition shadow-sm"
                                                >
                                                    Unblock
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        handleBlock(user.id)
                                                    }
                                                    className="px-3.5 py-2 bg-red-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-600 active:bg-red-700 transition shadow-sm"
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

                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-100">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToPage={goToPage}
                            nextPage={nextPage}
                            previousPage={previousPage}
                        />
                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminUsers;