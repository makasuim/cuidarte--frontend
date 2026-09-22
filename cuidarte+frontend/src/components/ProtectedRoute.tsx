import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};