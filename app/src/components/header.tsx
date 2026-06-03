import { useState } from 'react'

import logo from '../assets/quantum_logo_1.png'
import { useAuth } from '../context/AuthContext'
import ExploreMenu from './header/ExploreMenu'
import LoginModal from './header/loginModal'
import '../styles/header_css/header.css'

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <header className="header">
      <div className="header__left">
        <div className="logo">
          <a href="/" aria-label="QuantumEd home">
            <img src={logo} alt="QuantumEd" />
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
        <label className="header__search">
          <input type="search" placeholder="Search" aria-label="Search courses" />
        </label>
        {isAuthenticated ? (
          <div className="header__session">
            <span>{user?.name ?? user?.email}</span>
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
