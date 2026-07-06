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
    <section className="border-t bg-muted/30" id="about-section">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="grid content-start gap-5">
          <header>
            <p className="text-xs font-medium uppercase text-muted-foreground">About QuantumEd</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Structured learning for advanced technical subjects.</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              QuantumEd organizes complex computing, science and engineering topics into guided
              learning paths. Each course connects theory, implementation and long-term practice
              so students and developers can build durable foundations.
            </p>
          </header>

          <Card>
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
              <Card className="rounded-lg" key={capability.title}>
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
              <div className="rounded-lg border bg-card p-4" key={metric.label}>
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
