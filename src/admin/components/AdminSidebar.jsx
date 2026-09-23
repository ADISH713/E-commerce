import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    IconLayoutDashboard,
    IconShoppingCart,
    IconUsers,
    IconPackage,
    IconTrash,
    IconLogout,
} from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

function AdminSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const links = [
        {
            name: 'Dashboard',
            path: '/admin',
            icon: <IconLayoutDashboard size={20} />,
        },
        {
            name: 'Products',
            path: '/admin/products',
            icon: <IconPackage size={20} />,
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: <IconUsers size={20} />,
        },
        {
            name: 'Orders',
            path: '/admin/orders',
            icon: <IconShoppingCart size={20} />,
        },
        {
            name: 'Trash',
            path: '/admin/trash',
            icon: <IconTrash size={20} />,
        },
    ];

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            dispatch(logout());
            navigate('/login', { replace: true });
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-black text-white p-3 md:p-5 z-50 flex flex-col">

            {/* Logo */}
            <h1 className="text-xl md:text-2xl font-bold text-orange-500 mb-8 text-center md:text-left">
                <span className="md:hidden">T</span>
                <span className="hidden md:inline">TORQUE</span>
            </h1>

            {/* Navigation */}
            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                isActive
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                            }`
                        }
                    >
                        {link.icon}

                        <span className="hidden md:inline">
                            {link.name}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition w-full"
            >
                <IconLogout size={20} />

                <span className="hidden md:inline">
                    Logout
                </span>
            </button>

        </aside>
    );
}

export default AdminSidebar;