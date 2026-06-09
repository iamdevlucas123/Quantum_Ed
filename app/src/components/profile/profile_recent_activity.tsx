import type { ProfileRecentActivityProps } from './profile_types';

export default function ProfileRecentActivity({ summary }: ProfileRecentActivityProps) {
  return (
    <section className="profile-card" id="profile-activity">
      <div className="profile-card__header profile-card__header--split">
        <h2>Recent Activity</h2>
        <a href="#profile-activity">View all activity</a>
      </div>

      <div className="profile-activity-list">
        {summary.recentActivity.map((item) => (
          <article className="profile-activity-item" key={item.id}>
            <span aria-hidden="true">+</span>
            <p>{item.label}</p>
            <time>{item.timeLabel}</time>
          </article>
        ))}
      </div>
    </section>
  );
}
