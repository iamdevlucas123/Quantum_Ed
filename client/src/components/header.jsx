import logo from '../assets/quantum_logo_1.png';
import ExploreMenu from './header/ExploreMenu';
import '../styles/header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="header__left">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <ExploreMenu />
            </div>
            <nav className="nav nav--secondary">
                <ul>
                    <li><a href="#">Github</a></li>
                </ul>
            </nav>
        </header>
    );
}
