import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { useAdminData } from './hooks/useAdminData';

function AdminLayout() {
    useAdminData();

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="min-w-0 ml-20 md:ml-64">
                <main className="p-4 md:p-6 overflow-x-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;