import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UserProtectedRoute({ children }) {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default UserProtectedRoute;