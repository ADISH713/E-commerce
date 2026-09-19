import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useAdminData } from './hooks/useAdminData';

function AdminLayout() {
    useAdminData();
    
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar />

            <div className="flex-1 min-w-0">
                <AdminHeader />

                <main className="p-4 md:p-6 overflow-x-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;