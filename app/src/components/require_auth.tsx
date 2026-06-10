import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';
import Loader from './loader';

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const openLoginModal = useUiStore((state) => state.openLoginModal);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, isLoading, openLoginModal]);

  if (isLoading) {
    return <Loader />;
  }

  //Redirect the uset to main page with the login modal open.
  if (!isAuthenticated) {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace to={`/?login=1&next=${encodeURIComponent(nextPath)}`} />;
  }

  return <Outlet />;
}
