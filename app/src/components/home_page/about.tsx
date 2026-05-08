import '../../styles/about.css';

const aboutCards = [
  {
    title: 'Structured Learning',
    description:
      'Follow organized paths that connect subjects, modules and lessons without losing the bigger picture.',
  },
  {
    title: 'Academic Depth',
    description:
      'Study mathematics, physics, computer science and quantum concepts with clear technical foundations.',
  },
  {
    title: 'Practical Progress',
    description:
      'Move from theory to application with lessons designed for long-term understanding and real projects.',
  },
];

export default function About() {
  return (
    <section className="about-section" id="about-section">
      <div className="about-section__intro">
        <p className="about-section__eyebrow">About QuantumEd</p>
        <h2>Learn advanced topics with structure, clarity and purpose.</h2>
        <p>
          QuantumEd brings together science, engineering and computing in one guided
          learning environment built for students who want strong foundations and practical direction.
        </p>
      </div>

      <div className="about-section__stats" aria-label="QuantumEd highlights">
        <div>
          <strong>4</strong>
          <span>Core areas</span>
        </div>
        <div>
          <strong>100+</strong>
          <span>Lessons planned</span>
        </div>
        <div>
          <strong>Free</strong>
          <span>Learning access</span>
        </div>
      </div>

      <div className="about-section__grid">
        {aboutCards.map((card) => (
          <article className="about-section__card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
