import { useEffect, useMemo, useState } from 'react';
import Header from '../components/header';
import GithubFooter from '../components/github_footer';
import { useAuth } from '../context/AuthContext';
import { AUTH_REQUIRED_EVENT } from '../services/http_client';
import { getUserProgress, type UserCourseProgress } from '../services/user_api';
import '../styles/profile.css';
const formatDate = (value?: string): string => {
  if (!value) {
    return 'Not available';
  }
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};
const clampProgress = (value: number): number => {
  return Math.min(100, Math.max(0, Math.round(value)));
};
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
      .catch((error) => {
        if (isMounted) {
          const message = error instanceof Error ? error.message : 'Could not load course progress';
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
  const completedCourses = useMemo(() => {
    return progresses.filter((item) => clampProgress(item.progress) >= 100);
  }, [progresses]);
  const averageProgress = useMemo(() => {
    if (progresses.length === 0) {
      return 0;
    }
    const total = progresses.reduce((sum, item) => sum + clampProgress(item.progress), 0);
    return Math.round(total / progresses.length);
  }, [progresses]);
  const openLogin = (): void => {
    window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
  };
  return (
    <>
      <Header />
      <main className="profile-page">
        <section className="profile-hero">
          <div>
            <p className="profile-hero__eyebrow">Profile</p>
            <h1>{user?.name ?? 'Your learning profile'}</h1>
            <p>{user?.email ?? 'Sign in to see your personal data and course dashboard.'}</p>
          </div>
          {isAuthenticated && user ? (
            <div className="profile-identity" aria-label="User summary">
              <span>{(user.name ?? user.email).slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{user.role}</strong>
                <small>Member since {formatDate(user.createdAt)}</small>
              </div>
            </div>
          ) : null}
        </section>
        {!isAuthenticated && !isLoading ? (
          <section className="profile-empty">
            <h2>Sign in required</h2>
            <p>Use your account to access personal information and course progress.</p>
            <button type="button" onClick={openLogin}>
              Log in
            </button>
          </section>
        ) : null}
        {isAuthenticated && user ? (
          <section className="profile-layout">
            <aside className="profile-panel profile-panel--personal" aria-label="Personal data">
              <h2>Personal data</h2>
              <dl className="profile-details">
                <div>
                  <dt>Name</dt>
                  <dd>{user.name ?? 'Not provided'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{user.role}</dd>
                </div>
                <div>
                  <dt>User ID</dt>
                  <dd>{user.id}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDate(user.updatedAt)}</dd>
                </div>
              </dl>
            </aside>
            <section className="profile-dashboard" aria-label="Course dashboard">
              <div className="profile-dashboard__stats">
                <article>
                  <span>{completedCourses.length}</span>
                  <p>Completed courses</p>
                </article>
                <article>
                  <span>{progresses.length}</span>
                  <p>Courses started</p>
                </article>
                <article>
                  <span>{averageProgress}%</span>
                  <p>Average progress</p>
                </article>
              </div>
              <div className="profile-panel">
                <div className="profile-panel__header">
                  <h2>Course progress</h2>
                  {isProgressLoading ? <span>Loading</span> : null}
                </div>
                {error ? <p className="profile-message profile-message--error">{error}</p> : null}
                {!isProgressLoading && progresses.length === 0 ? (
                  <div className="profile-message">
                    <h3>No courses started yet</h3>
                    <p>Courses will appear here after progress is saved for your account.</p>
                    <a href="/courses">Browse courses</a>
                  </div>
                ) : null}
                <div className="profile-courses">
                  {progresses.map((item) => {
                    const progress = clampProgress(item.progress);
                    const subject = item.course.topic?.subject?.name ?? item.course.topic?.name ?? 'Course';
                    return (
                      <article className="profile-course" key={item.id}>
                        <div className="profile-course__top">
                          <span>{subject}</span>
                          <strong>{progress}%</strong>
                        </div>
                        <h3>{item.course.title}</h3>
                        <p>{item.course.description}</p>
                        <div className="profile-course__track" aria-hidden="true">
                          <span style={{ width: `${progress}%` }} />
                        </div>
                        <div className="profile-course__meta">
                          <span>{item.course.lessonsCount} lessons</span>
                          <span>{item.course.hoursCount} hours</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </section>
        ) : null}
      </main>
      <GithubFooter />
    </>
  );
}
