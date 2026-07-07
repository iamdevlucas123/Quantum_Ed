import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <section className="border-t bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,247,249,0.72))]" id="about-section">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="grid content-start gap-5">
          <header>
            <p className="text-xs font-semibold uppercase text-primary">About QuantumEd</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">Structured learning for advanced technical subjects.</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              QuantumEd organizes complex computing, science and engineering topics into guided
              learning paths. Each course connects theory, implementation and long-term practice
              so students and developers can build durable foundations.
            </p>
          </header>

          <Card className="rounded-lg border-primary/10 bg-white/90 shadow-[0_18px_52px_rgba(32,54,92,0.08)]">
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Make rigorous technical education easier to navigate by replacing scattered
              tutorials with clear sequencing, focused context and practical application.
            </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {aboutCapabilities.map((capability) => (
              <Card className="rounded-lg border-primary/10 bg-white/90 shadow-[0_12px_36px_rgba(32,54,92,0.07)]" key={capability.title}>
                <CardHeader>
                  <CardTitle className="text-base">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <dl className="grid gap-4 sm:grid-cols-3" aria-label="QuantumEd highlights">
            {aboutMetrics.map((metric) => (
              <div className="rounded-lg border border-primary/10 bg-white/90 p-4 shadow-sm" key={metric.label}>
                <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                <dd className="mt-2 text-xl font-semibold">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
