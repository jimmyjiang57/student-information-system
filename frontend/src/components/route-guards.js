import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth() {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!role) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function InstructorOnly() {
  const { isInstructor, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isInstructor) return <Navigate to="/assignments" replace />;
  return <Outlet />;
}
