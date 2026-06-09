import type { ProfileHeroProps } from './profile_types';

const tabs = ['Overview', 'Courses', 'Certificates', 'Activity', 'Saved'];

export default function ProfileHero({ isAuthenticated, isLoading, onRequestLogin }: ProfileHeroProps) {
  return (
    <>
      <section className="profile-shell__tabs" aria-label="Profile sections">
        <nav className="profile-tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              aria-current={index === 0 ? 'page' : undefined}
              className={index === 0 ? 'is-active' : undefined}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>
      </section>

      {!isAuthenticated && !isLoading ? (
        <section className="profile-empty">
          <h2>Authentication required</h2>
          <p>Sign in to see your learning dashboard, courses, streak, study activity and earned badges.</p>
          <button type="button" onClick={onRequestLogin}>
            Open login
          </button>
        </section>
      ) : null}
    </>
  );
}
