import { useEffect, useMemo, useState } from 'react';

import GithubFooter from '../components/github_footer';
import Header from '../components/header';
import ProfileBadges from '../components/profile/profile_badges';
import ProfileCourseProgress from '../components/profile/profile_course_progress';
import ProfileHero from '../components/profile/profile_hero';
import ProfileIdentityPanel from '../components/profile/profile_identity_panel';
import { buildProfileSummary } from '../components/profile/profile_mapper';
import ProfileOverview from '../components/profile/profile_overview';
import ProfileRecentActivity from '../components/profile/profile_recent_activity';
import ProfileStats from '../components/profile/profile_stats';
import type { ProfileSummary } from '../components/profile/profile_types';
import { useAuth } from '../context/AuthContext';
import { AUTH_REQUIRED_EVENT } from '../services/http_client';
import { getUserProgress, type UserCourseProgress } from '../services/user_api';
import '../styles/profile.css';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [progresses, setProgresses] = useState<UserCourseProgress[]>([]);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProgresses([]);
      return;
    }

    let isMounted = true;
    setIsProgressLoading(true);
    setError(null);

    getUserProgress(user.id)
      .then((data) => {
        if (isMounted) {
          setProgresses(data);
        }
      })
      .catch((currentError) => {
        if (isMounted) {
          const message = currentError instanceof Error ? currentError.message : 'Could not load course progress';
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsProgressLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const summary = useMemo(() => {
    return buildProfileSummary({
      userName: user?.name ?? undefined,
      email: user?.email ?? undefined,
      createdAt: user?.createdAt ?? undefined,
      role: user?.role ?? 'STUDENT',
      items: progresses,
    });
  }, [progresses, user?.createdAt, user?.email, user?.name, user?.role]);

  const openLogin = (): void => {
    window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
  };

  return (
    <>
      <Header />
      <main className="profile-page">
        <div className="profile-shell">
          <ProfileHero
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            onRequestLogin={openLogin}
          />

          {isAuthenticated && user ? (
            <section className="profile-layout">
              <ProfileIdentityPanel summary={summary} user={user} />

              <section className="profile-dashboard" aria-label="Course dashboard">
                <ProfileOverview summary={summary} />
                <ProfileCourseProgress
                  error={error}
                  isLoading={isProgressLoading}
                  items={progresses}
                  summary={summary}
                />
                <ProfileStats summary={summary} />
                <ProfileBadges summary={summary} />
                <ProfileRecentActivity summary={summary} />
              </section>
            </section>
          ) : null}
        </div>
      </main>
      <GithubFooter />
    </>
  );
}
