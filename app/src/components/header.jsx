import logo from '../assets/quantum_logo_1.png';
import ExploreMenu from './header/ExploreMenu';
import '../styles/header.css';

export default function Header() {

    const handleScroll = () => {
        document.getElementById("about-section").scrollIntoView({behavior: "smooth"});
    };

    return (
        <header className="header">
            <div className="header__left">
                <div className="logo">
                        <a href="/"><img src={logo} alt="Logo" /></a>
                </div>
                <ExploreMenu />
            </div>
            <nav className="nav nav--secondary">
                <ul>
                    <li><a href="#" onClick={handleScroll}>About</a></li>
                    <li>
                        <button id="login">Login</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
