import { useRef, type ChangeEvent } from 'react';

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

export default function ProfileIdentityPanel({
  avatarError,
  isAvatarSaving,
  onAvatarChange,
  summary,
  user,
}: ProfileIdentityPanelProps) {
  const displayName = user.name ?? user.email;
  const initial = displayName.slice(0, 1).toUpperCase();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (file) {
      onAvatarChange(file);
    }

    event.target.value = '';
  };

  return (
    <aside className="profile-sidebar" aria-label="Profile summary">
      <div className="profile-sidebar__avatar">
        {user.avatarUrl ? (
          <img className="profile-sidebar__avatar-image" src={user.avatarUrl} alt={`${displayName} profile`} />
        ) : (
          <div className="profile-sidebar__avatar-core" aria-hidden="true">{initial}</div>
        )}
        <button
          aria-label="Upload profile photo"
          className="profile-sidebar__avatar-upload"
          disabled={isAvatarSaving}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
        <input
          accept="image/*"
          className="profile-sidebar__avatar-input"
          data-testid="profile-avatar-input"
          disabled={isAvatarSaving}
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
      </div>
      {avatarError ? <p className="profile-sidebar__feedback">{avatarError}</p> : null}
      {isAvatarSaving ? <p className="profile-sidebar__feedback">Saving photo...</p> : null}

      <h1>{displayName}</h1>
      <p className="profile-sidebar__handle">@{summary.username}</p>
      <p className="profile-sidebar__bio">{summary.userDescription}</p>

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
