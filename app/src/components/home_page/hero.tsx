import '../../styles/home_page_css/hero.css';

export default function Hero() {
    const developerCount = '12,480';

    return(
        <section className="main">
            <div className="main__copy">
                <p className="main__eyebrow">Orbital Academy</p>
                <h1>Train for the next frontier of engineering.</h1>
                <p>
                    QuantumEd turns advanced science and computing into a guided mission:
                    structured roadmaps, practical lessons and zero-cost access.
                </p>
                <div className="main__actions">
                    <a href="/courses">Launch Courses</a>
                    <a className="main__action-secondary" href="#about-section">Mission Brief</a>
                </div>
                <p id="developer-counter">
                    Active cadets
                    <span>{developerCount}</span>
                </p>
            </div>

            <div className="main__scene" aria-hidden="true">
                <img className="main__planet main__planet--primary" src="/assets/backgrounds/planet-indigo-shadow.png" alt="" />
                <img className="main__planet main__planet--secondary" src="/assets/backgrounds/planet-teal-shadow.png" alt="" />
    
            </div>
        </section>
    )
}
