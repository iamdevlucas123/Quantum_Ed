'use client'

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';
import ExploreMenu from './header/explore_menu';
import LoginModal from './header/login_modal';
import '../styles/header_css/header.css';

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isLoginModalOpen = useUiStore((state) => state.isLoginModalOpen);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const closeLoginModalState = useUiStore((state) => state.closeLoginModal);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginParam = searchParams?.get('login') ?? null;

  useEffect(() => {
    if (loginParam === '1' && !isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, loginParam, openLoginModal]);

  const closeLoginModal = (): void => {
    if (loginParam === '1') {
      const nextParams = new URLSearchParams(searchParams ?? undefined);
      nextParams.delete('login');
      nextParams.delete('next');
      nextParams.delete('oauth_error');
      const nextQuery = nextParams.toString();
      const nextPathname = pathname ?? '/';
      router.replace(nextQuery ? `${nextPathname}?${nextQuery}` : nextPathname);
    }

    closeLoginModalState();
  };

  return (
    <header className="header">
      <div className="header__left">
        <div className="logo">
          <a href="/" aria-label="QuantumEd home">
            <img src="/assets/icons/quantum-atom-mark.png" alt="QuantumEd" />
          </a>
        </div>
        <ExploreMenu />
        <nav className="nav header__links" aria-label="Main navigation">
          <ul>
            <li>
              <a href="/courses">Courses</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header__actions">
        {isAuthenticated ? (
          <div className="header__session">
            <a className="header__profile-link" href="/profile">
              {user?.name ?? user?.email}
            </a>
            <button id="login" data-testid="logout-button" type="button" onClick={() => void logout()}>
              Log Out
            </button>
          </div>
        ) : (
          <button id="login" data-testid="auth-open-button" type="button" disabled={isLoading} onClick={openLoginModal}>
            Log In
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
