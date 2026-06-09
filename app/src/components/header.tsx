import { useEffect, useState } from 'react'

import { useAuth } from '../context/AuthContext'
import { AUTH_REQUIRED_EVENT } from '../services/http_client'
import ExploreMenu from './header/ExploreMenu'
import LoginModal from './header/loginModal'
import '../styles/header_css/header.css'

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const openLoginModal = () => setIsLoginModalOpen(true)

    window.addEventListener(AUTH_REQUIRED_EVENT, openLoginModal)

    return () => {
      window.removeEventListener(AUTH_REQUIRED_EVENT, openLoginModal)
    }
  }, [])

  return (
    <header className="header">
      <div className="header__left">
        <div className="logo">
          <a href="/" aria-label="QuantumEd home">
            <img src="/assets/icons/quantum-atom-mark.png" alt="QuantumEd" />
          </a>
        </div>
        <div className="header__status" aria-label="Platform status">
          <span className="header__status-dot" aria-hidden="true" />
          <span>Orbital campus online</span>
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
        <label className="header__search">
          <img className="header__search-icon" src="/assets/icons/quantum-atom-mark.png" alt="" />
          <input type="search" placeholder="Search" aria-label="Search courses" />
        </label>
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
          <button id="login" type="button" disabled={isLoading} onClick={() => setIsLoginModalOpen(true)}>
            Log In
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}
