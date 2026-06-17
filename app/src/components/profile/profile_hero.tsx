import type { ProfileHeroProps } from './profile_types';

export default function ProfileHero({ isAuthenticated, isLoading, onRequestLogin }: ProfileHeroProps) {
  return (
    <>
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
