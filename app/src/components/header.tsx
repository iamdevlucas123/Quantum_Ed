import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';
import ExploreMenu from './header/ExploreMenu';
import LoginModal from './header/loginModal';
import '../styles/header_css/header.css';

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isLoginModalOpen = useUiStore((state) => state.isLoginModalOpen);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const closeLoginModalState = useUiStore((state) => state.closeLoginModal);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal, searchParams]);

  const closeLoginModal = (): void => {
    if (searchParams.get('login') === '1') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('login');
      nextParams.delete('next');
      nextParams.delete('oauth_error');
      setSearchParams(nextParams, { replace: true });
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
            <button id="login" type="button" onClick={() => void logout()}>
              Log Out
            </button>
          </div>
        ) : (
          <button id="login" type="button" disabled={isLoading} onClick={openLoginModal}>
            Log In
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
