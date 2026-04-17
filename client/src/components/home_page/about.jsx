export default function About() {
    return (
        <section id="about-section" className="about-section">
            <div className="about-section__intro">
                <p className="about-section__eyebrow">About QuantumEd</p>
                <h2>Learn complex subjects with structure, clarity and real academic depth.</h2>
                <p>
                    QuantumEd was designed to make advanced learning feel guided instead of overwhelming.
                    We bring together mathematics, physics, computer science and quantum computing in
                    one environment focused on progression, context and practical understanding.
                </p>
            </div>

            <div className="about-section__grid">
                <article className="about-section__card">
                    <span>Structured Paths</span>
                    <p>
                        Study from fundamentals to advanced topics through organized subjects, modules
                        and lessons that build on each other.
                    </p>
                </article>

                <article className="about-section__card">
                    <span>Applied Learning</span>
                    <p>
                        Connect theory with examples, guided notes and curated course flows that make
                        abstract concepts easier to retain.
                    </p>
                </article>

                <article className="about-section__card">
                    <span>Future-Focused</span>
                    <p>
                        Explore the bridge between classical foundations and emerging areas like AI,
                        computation and quantum technologies.
                    </p>
                </article>
            </div>
        </section>
    );
}
