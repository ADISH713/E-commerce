import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, unblockUser,} from '../../redux/slices/userSlice';    
import { updateUser,} from '../../services/userServices';
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

    const filteredUser = users.filter((user)=>{
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase())||user.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true :statusFilter === 'active' ? !user.blocked : user.blocked ;

        return matchesSearch && matchesStatus;
    })

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
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p className="text-red-600">Error: {error}</p>;
    }

    return (
        <div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h2 className="text-2xl font-semibold">
                    Users
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
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
                        className="border rounded-lg px-4 py-2 w-full sm:w-64"
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
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active Users</option>
                        <option value="blocked">Blocked Users</option>
                    </select>
                </div>

            </div>
            
            {filteredUser.length === 0 ? (
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
                            {paginatedUsers.map((user) => (
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
                </div>
            )}
        </div>
    );
}

export default AdminUsers;