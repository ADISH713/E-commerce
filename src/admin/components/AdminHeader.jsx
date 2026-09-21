import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconLogout } from '@tabler/icons-react';
import { logout } from '../../redux/slices/authSlice';
import Swal from 'sweetalert2';

function AdminHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of the admin panel.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#f97316',
        });

        if (!result.isConfirmed) return;

        dispatch(logout());

        navigate('/login', {
            replace: true,
        });
};

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-gray-800">
                Admin Panel
            </h2>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
            >
                <IconLogout size={20} />
                <span>Logout</span>
            </button>
        </header>
    );
}

export default AdminHeader;