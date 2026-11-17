import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserProtectedRoute({ children }) {
    const { user, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default UserProtectedRoute;