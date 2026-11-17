
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const {isAuthenticated, isLoading} = useSelector((state)=>state.auth);

    if(isLoading){
        return null;
    }

    if(!isAuthenticated){
        return(<Navigate to="/login" replace/>);
    }
    return children
}

export default ProtectedRoute;