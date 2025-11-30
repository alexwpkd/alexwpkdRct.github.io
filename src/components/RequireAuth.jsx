import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Wrapper to protect routes based on JWT presence and allowed roles.
 * Props:
 * - allowedRoles: array of lowercase role strings, e.g. ['admin','empleado']
 */
const RequireAuth = ({ allowedRoles = [], children }) => {
  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('userRole') || '').toLowerCase();

  if (!token) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Authenticated but forbidden
    return <div className="container py-5"><h3>No tienes permisos para ver esta página.</h3></div>;
  }

  return children;
};

export default RequireAuth;
