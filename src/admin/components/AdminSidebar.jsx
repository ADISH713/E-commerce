import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    IconLayoutDashboard,
    IconShoppingCart,
    IconUsers,
    IconPackage,
} from '@tabler/icons-react';

function AdminSidebar() {
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
    ];

    return (
        <aside className="w-20 md:w-64 min-h-screen bg-black text-white p-3 md:p-5 shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-orange-500 mb-8 text-center md:text-left">
                <span className="md:hidden">T</span>
                <span className="hidden md:inline">TORQUE</span>
            </h1>

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
        </aside>
    );
}

export default AdminSidebar;