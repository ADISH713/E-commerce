import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar />

            <div className="flex-1">
                <AdminHeader />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;