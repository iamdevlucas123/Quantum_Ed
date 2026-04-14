
export default function Header() {
    return(
        <header className="header">
            <div className="logo">
                <img src="/src/assets/quantum_logo.png" alt="Logo" />
            </div>
            <nav className="nav">
                <ul>
                    <li><a href="#">Explore</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Github</a></li>
                </ul>
            </nav>
        </header>
    )
}

