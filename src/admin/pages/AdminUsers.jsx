import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import { getAdminUsers, setUserBlocked } from '../../services/userServices';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 5;

function AdminUsers() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlSearch = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const page = Number(searchParams.get('page')) || 1;

    const [searchInput, setSearchInput] = useState(urlSearch);
    const [busyId, setBusyId] = useState(null);

    // change several URL params at once; null removes a param
    const updateParams = (changes) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            Object.entries(changes).forEach(([key, value]) => {
                if (value === null || value === '') params.delete(key);
                else params.set(key, String(value));
            });
            return params;
        });
    };

    // wait 400ms after typing, then put the search in the URL
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() === urlSearch) return;

            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                if (searchInput.trim()) params.set('search', searchInput.trim());
                else params.delete('search');
                params.set('page', '1');
                return params;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, urlSearch, setSearchParams]);

    const {
        data,
        isLoading,
        isError,
        error: loadError,
    } = useQuery({
        queryKey: ['admin-users', { page, status: statusFilter, search: urlSearch }],
        queryFn: () =>
            getAdminUsers({
                page,
                limit: PAGE_SIZE,
                status: statusFilter === 'all' ? undefined : statusFilter,
                search: urlSearch || undefined,
            }),
        placeholderData: keepPreviousData,
    });

    const users = data?.users ?? [];
    const totalPages = data?.pages ?? 1;

    // if the last user on the last page leaves this filter, step back one page
    useEffect(() => {
        if (data && data.pages > 0 && page > data.pages) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set('page', String(data.pages));
                return params;
            });
        }
    }, [data, page, setSearchParams]);

    const goToPage = (target) => updateParams({ page: target });
    const nextPage = () => page < totalPages && goToPage(page + 1);
    const previousPage = () => page > 1 && goToPage(page - 1);

    const handleBlockChange = async (user, isBlocked) => {
        if (busyId) return;

        if (isBlocked) {
            const result = await Swal.fire({
                title: 'Block this user?',
                text: `${user.name} will no longer be able to log in or use their account.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Block',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
            });

            if (!result.isConfirmed) return;
        }

        setBusyId(user.id);

        try {
            await setUserBlocked(user.id, isBlocked);
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success(isBlocked ? 'User blocked' : 'User unblocked');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Failed to update user'));
        } finally {
            setBusyId(null);
        }
    };

    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading users...</p>;
    }

    if (isError) {
        return (
            <p className="text-sm text-red-600">
                Error: {getErrorMessage(loadError)}
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
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full sm:w-64 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            updateParams({
                                status: e.target.value === 'all' ? null : e.target.value,
                                page: 1,
                            })
                        }
                    
                        className="w-full sm:w-auto border border-gray-200 bg-white rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="blocked">Blocked Users</option>
                    </select>

                </div>
            </div>

            {/* Empty state */}
            {users.length === 0 ? (

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

                                {users.map((user) => (

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
                                                    onClick={() => handleBlockChange(user, false)}
                                                    disabled={busyId === user.id}
                                                    className="px-3.5 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 active:bg-green-800 transition shadow-sm"
                                                >
                                                    Unblock
                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() => handleBlockChange(user, true)}
                                                    disabled={busyId === user.id}
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
                            currentPage={page}
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