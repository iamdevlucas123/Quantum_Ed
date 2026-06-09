import type { ProfileIdentityPanelProps } from './profile_types';

const sidebarStats = (summary: ProfileIdentityPanelProps['summary']) => [
  { label: 'Courses Enrolled', value: summary.startedCourses },
  { label: 'Certificates Earned', value: summary.certificatesEarned },
  { label: 'Day Streak', value: summary.streakDays },
];

const infoRows = (summary: ProfileIdentityPanelProps['summary']) => [
  { label: 'Location', value: summary.locationLabel },
  { label: 'Joined', value: summary.joinDateLabel },
  { label: 'Learning Level', value: summary.learningLevelLabel },
  { label: 'Local Time', value: summary.localTimeLabel },
];

export default function ProfileIdentityPanel({ summary, user }: ProfileIdentityPanelProps) {
  const displayName = user.name ?? user.email;
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <aside className="profile-sidebar" aria-label="Profile summary">
      <div className="profile-sidebar__avatar" aria-hidden="true">
        <div className="profile-sidebar__avatar-core">{initial}</div>
      </div>

      <h1>{displayName}</h1>
      <p className="profile-sidebar__handle">@{summary.username}</p>
      <p className="profile-sidebar__bio">{summary.userDescription}</p>

      <button className="profile-sidebar__button" type="button">
        Edit Profile
      </button>

      <div className="profile-sidebar__metrics" aria-label="Profile quick stats">
        {sidebarStats(summary).map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      <dl className="profile-sidebar__details">
        {infoRows(summary).map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
