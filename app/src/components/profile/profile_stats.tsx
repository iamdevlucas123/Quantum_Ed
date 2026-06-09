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
    <section className="profile-card">
      <div className="profile-card__header">
        <h2>Learning Stats</h2>
      </div>

      <div className="profile-stats-grid">
        {statCards(summary).map((card) => (
          <article className="profile-stat-card" key={card.label}>
            <h3>{card.label}</h3>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
            <div className={`profile-stat-card__chart profile-stat-card__chart--${card.variant}`} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <a href="#profile-courses">{card.linkLabel}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
