import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAuth = true, requireProducts = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // No role enforcement; any authenticated user can access

  return children;
};

export default ProtectedRoute;
