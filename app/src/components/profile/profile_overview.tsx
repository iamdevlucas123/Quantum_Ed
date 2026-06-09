import type { ProfileOverviewProps } from './profile_types';

const streakCaption = (days: number): string => {
  if (days >= 14) {
    return 'Keep it up';
  }

  if (days >= 7) {
    return 'Solid pace';
  }

  return 'Build momentum';
};

export default function ProfileOverview({ summary }: ProfileOverviewProps) {
  return (
    <>
      <section className="profile-main-grid">
        <article className="profile-card profile-card--journey">
          <div className="profile-card__header">
            <h2>About / Learning Journey</h2>
          </div>
          <p>{summary.userDescription}</p>
          <div className="profile-card__copy-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <button className="profile-card__button" type="button">
            Update Bio
          </button>
        </article>

        <div className="profile-main-grid__mini-cards">
          <article className="profile-card profile-card--mini">
            <div className="profile-card__header">
              <h2>Learning Streak</h2>
            </div>
            <div className="profile-mini-stat">
              <strong>{summary.streakDays}</strong>
              <span>days</span>
            </div>
            <p>{streakCaption(summary.streakDays)}</p>
          </article>

          <article className="profile-card profile-card--mini">
            <div className="profile-card__header">
              <h2>Hours Studied</h2>
            </div>
            <div className="profile-mini-stat">
              <strong>{summary.estimatedStudyHours}</strong>
              <span>hrs</span>
            </div>
            <p>+{summary.weeklyHoursStudied} hrs this week</p>
          </article>
        </div>

        <article className="profile-card profile-card--progress">
          <div className="profile-card__header">
            <h2>Overall Progress</h2>
          </div>
          <div
            aria-label={`${summary.averageProgress}% of learning journey completed`}
            className="profile-progress-ring"
            style={{ ['--progress' as string]: String(summary.averageProgress) }}
          >
            <span>{summary.averageProgress}%</span>
          </div>
          <p>{summary.averageProgress}% of learning journey completed</p>
          <a href="#profile-courses">View full progress</a>
        </article>
      </section>
    </>
  );
}
