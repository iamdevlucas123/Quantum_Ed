import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Loader from './loader';
import { useAuth } from '../context/auth_store';
import { AUTH_REQUIRED_EVENT } from '../services/http_client';

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace to={`/?login=1&next=${encodeURIComponent(nextPath)}`} />;
  }

  return <Outlet />;
}
