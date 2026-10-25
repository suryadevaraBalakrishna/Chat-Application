import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function PublicRoute({ children }) {

    const token = useSelector((state) => state.login.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}