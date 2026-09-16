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
        <aside className="w-64 min-h-screen bg-black text-white p-5">
            <h1 className="text-2xl font-bold text-orange-500 mb-8">
                TORQUE
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
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default AdminSidebar;