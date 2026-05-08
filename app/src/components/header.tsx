import logo from '../assets/quantum_logo_1.png';
import ExploreMenu from './header/ExploreMenu';
import '../styles/header_css/header.css';

export default function Header() {
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
                        <li><a href="/courses">Courses</a></li>
                    </ul>
                </nav>
            </div>

            <div className="header__actions">
                <label className="header__search">
                    <span aria-hidden="true">⌕</span>
                    <input type="search" placeholder="Search" aria-label="Search courses" />
                </label>
                <button id="login" type="button">Log In</button>
            </div>
        </header>
    );
}
