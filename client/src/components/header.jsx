import logo from '../assets/quantum_logo_1.png';
import { useState } from 'react';
import '../styles/header.css';

export default function Header() {
    //
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        //for each subject, create a menu item
    ];

    const handleToggle = () => {
        setIsOpen((currentState) => !currentState);
    };

    return(
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Logo"/>
            </div>
            <nav className="nav">
                <ul>
                    <li className={`explore-menu ${isOpen ? 'is-open' : ''}`}>
                        <button
                            type="button"
                            className="explore-menu__toggle"
                            onClick={handleToggle}
                            aria-expanded={isOpen}
                            aria-haspopup="true"
                        >
                            Explore
                        </button>

                        {isOpen && (
                            <div className="explore-menu__dropdown">
                                {menuItems.map((item) => (
                                    <a key={item} href="#" className="explore-menu__link">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        )}
                    </li>
                    <li><a href="#">Github</a></li>
                </ul>
            </nav>
        </header>
    )
}
