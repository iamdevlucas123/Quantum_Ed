import type { ProfileBadgesProps } from './profile_types';

export default function ProfileBadges({ summary }: ProfileBadgesProps) {
  return (
    <section className="profile-card">
      <div className="profile-card__header profile-card__header--split">
        <h2>Badges &amp; Certificates</h2>
        <a href="#profile-activity">View all</a>
      </div>

      <div className="profile-badges-grid">
        {summary.badges.map((badge) => (
          <article className="profile-badge-card" key={badge.label}>
            <span aria-hidden="true">{badge.icon}</span>
            <strong>{badge.label}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
