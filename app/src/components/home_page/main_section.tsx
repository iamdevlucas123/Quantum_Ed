
import '../../styles/main_section.css';

export default function Main() {
    const developerCount = '345';

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
