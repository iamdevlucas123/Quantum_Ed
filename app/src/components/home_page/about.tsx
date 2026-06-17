import '../../styles/home_page_css/about.css';

const aboutCapabilities = [
  {
    title: 'Guided paths',
    description:
      'Courses are sequenced around foundations, modules and lessons so each topic builds on the previous one.',
  },
  {
    title: 'Technical foundations',
    description:
      'Core ideas are introduced with enough theory to support real implementation decisions.',
  },
  {
    title: 'Applied projects',
    description:
      'Lessons connect concepts to practical work, helping learners move from explanation to usable systems.',
  },
  {
    title: 'Progress continuity',
    description:
      'The learning model favors long-term understanding over isolated tutorials and disconnected examples.',
  },
];

const aboutMetrics = [
  {
    value: '4',
    label: 'Learning domains',
  },
  {
    value: 'Free',
    label: 'Access model',
  },
  {
    value: 'Modular',
    label: 'Course format',
  },
];

export default function About() {
  return (
    <section className="about-section" id="about-section">
      <div className="about-section__layout">
        <div className="about-section__content">
          <header className="about-section__intro">
            <p className="about-section__eyebrow">About QuantumEd</p>
            <h2>Structured learning for advanced technical subjects.</h2>
            <p>
              QuantumEd organizes complex computing, science and engineering topics into guided
              learning paths. Each course connects theory, implementation and long-term practice
              so students and developers can build durable foundations.
            </p>
          </header>

          <article className="about-section__mission">
            <span>Mission</span>
            <p>
              Make rigorous technical education easier to navigate by replacing scattered
              tutorials with clear sequencing, focused context and practical application.
            </p>
          </article>
        </div>

        <div className="about-section__details">
          <div className="about-section__capabilities">
            {aboutCapabilities.map((capability) => (
              <article className="about-section__capability" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>

          <dl className="about-section__metrics" aria-label="QuantumEd highlights">
            {aboutMetrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
