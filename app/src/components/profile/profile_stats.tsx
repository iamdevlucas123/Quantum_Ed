import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileStatsProps } from './profile_types';

const statCards = (summary: ProfileStatsProps['summary']) => [
  {
    label: 'Completion Rate',
    value: `${summary.averageProgress}%`,
    detail: `+${summary.completionDelta}% vs last month`,
    variant: 'line',
    linkLabel: 'View details',
  },
  {
    label: 'Quiz Average Score',
    value: `${summary.quizAverageScore}%`,
    detail: `+${summary.quizDelta}% vs last month`,
    variant: 'bars',
    linkLabel: 'View quiz history',
  },
  {
    label: 'Certificates Earned',
    value: String(summary.certificatesEarned),
    detail: 'View all',
    variant: 'seal',
    linkLabel: 'Browse certificates',
  },
  {
    label: 'Weekly Study Goal',
    value: `${summary.weeklyHoursStudied} / ${summary.weeklyGoalHours} hrs`,
    detail: `${summary.weeklyHoursLeft} hrs left this week`,
    variant: 'goal',
    linkLabel: 'Edit goal',
  },
];

export default function ProfileStats({ summary }: ProfileStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Stats</CardTitle>
      </CardHeader>

      <CardContent>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards(summary).map((card) => (
          <article className="rounded-lg border bg-background p-4" key={card.label}>
            <h3 className="text-sm font-medium text-muted-foreground">{card.label}</h3>
            <strong className="mt-2 block text-2xl">{card.value}</strong>
            <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
            <div className="mt-4 flex h-10 items-end gap-1" aria-hidden="true">
              <span className="h-4 flex-1 rounded bg-primary/30" />
              <span className="h-7 flex-1 rounded bg-primary/50" />
              <span className="h-5 flex-1 rounded bg-primary/40" />
              <span className="h-9 flex-1 rounded bg-primary/70" />
              <span className="h-6 flex-1 rounded bg-primary/60" />
            </div>
            <a className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline" href="#profile-courses">{card.linkLabel}</a>
          </article>
        ))}
      </div>
      </CardContent>
    </Card>
  );
}
