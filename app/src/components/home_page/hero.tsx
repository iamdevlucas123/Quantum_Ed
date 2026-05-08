
import '../../styles/home_page_css/hero.css';

export default function Hero() {
    const developerCount = "<count>"; // This is a placeholder. You can replace it with actual data from your backend or state management.

    return(
        <section>
            <section className="main">
                <div>
                    <h1>Welcome to QuantumEd</h1>
                    <p>The journey of learning everything without paying a single cent.</p>
                    <p id="developer-counter">Where <span>{developerCount}</span> developers learn</p>
                </div>
                <img id="developer-image" src="../../../public/image.png" alt="Developer learning" />
            </section>
        </section>
    )
}
