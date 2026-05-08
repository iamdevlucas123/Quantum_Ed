
import '../../styles/hero.css';

export default function Hero() {
    const developerCount = "<count>"; // This is a placeholder. You can replace it with actual data from your backend or state management.

    return(
        <section>
            <section className="main">
                <h1>Welcome to QuantumEd</h1>
                <p>The journey of learning everything without paying a single cent.</p>
            </section>
            <p id="developer-counter">
                Where <span>{developerCount}</span> developers learn
            </p>
        </section>
    )
}
