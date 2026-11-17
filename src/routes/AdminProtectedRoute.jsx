import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminProtectedRoute({ children }) {
    const { user, isAuthenticated, isLoading } = useSelector(
        (state) => state.auth
    );

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminProtectedRoute;