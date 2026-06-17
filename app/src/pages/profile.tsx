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
import { useAuth } from '../context/auth_store';
import { useUiStore } from '../context/ui_store';
import { getUserProgress, updateCurrentUserProfile, type UserCourseProgress } from '../services/user_api';
import '../styles/profile.css';

const BIO_MAX_LENGTH = 280;
const AVATAR_FILE_MAX_BYTES = 80 * 1024;

export default function Profile() {
  const { updateUser, user, isAuthenticated, isLoading } = useAuth();
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const [progresses, setProgresses] = useState<UserCourseProgress[]>([]);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBioEditing, setIsBioEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [bioError, setBioError] = useState<string | null>(null);
  const [isBioSaving, setIsBioSaving] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isAvatarSaving, setIsAvatarSaving] = useState(false);

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
      bio: user?.bio,
      items: progresses,
    });
  }, [progresses, user?.bio, user?.createdAt, user?.email, user?.name, user?.role]);

  const openLogin = (): void => {
    openLoginModal();
  };

  const startBioEdit = (): void => {
    setBioDraft(user?.bio ?? '');
    setBioError(null);
    setIsBioEditing(true);
  };

  const cancelBioEdit = (): void => {
    setBioDraft(user?.bio ?? '');
    setBioError(null);
    setIsBioEditing(false);
  };

  const saveBio = async (): Promise<void> => {
    if (!user) {
      return;
    }

    const trimmedBio = bioDraft.trim();

    if (trimmedBio.length > BIO_MAX_LENGTH) {
      setBioError(`Bio must be ${BIO_MAX_LENGTH} characters or fewer.`);
      return;
    }

    setIsBioSaving(true);
    setBioError(null);

    try {
      const updatedUser = await updateCurrentUserProfile({ bio: trimmedBio });
      updateUser(updatedUser);
      setBioDraft(updatedUser.bio ?? '');
      setIsBioEditing(false);
    } catch (currentError) {
      const message = currentError instanceof Error ? currentError.message : 'Could not update bio';
      setBioError(message);
    } finally {
      setIsBioSaving(false);
    }
  };

  const updateAvatar = async (file: File): Promise<void> => {
    if (!user) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('Choose an image file.');
      return;
    }

    if (file.size > AVATAR_FILE_MAX_BYTES) {
      setAvatarError('Choose an image smaller than 80KB.');
      return;
    }

    setAvatarError(null);
    setIsAvatarSaving(true);

    const reader = new FileReader();

    reader.onload = async () => {
      const avatarUrl = typeof reader.result === 'string' ? reader.result : null;

      if (!avatarUrl) {
        setAvatarError('Could not read selected image.');
        setIsAvatarSaving(false);
        return;
      }

      try {
        const updatedUser = await updateCurrentUserProfile({ avatarUrl });
        updateUser(updatedUser);
      } catch (currentError) {
        const message = currentError instanceof Error ? currentError.message : 'Could not update profile photo';
        setAvatarError(message);
      } finally {
        setIsAvatarSaving(false);
      }
    };

    reader.onerror = () => {
      setAvatarError('Could not read selected image.');
      setIsAvatarSaving(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-route">
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
              <ProfileIdentityPanel
                avatarError={avatarError}
                isAvatarSaving={isAvatarSaving}
                onAvatarChange={updateAvatar}
                summary={summary}
                user={user}
              />

              <section className="profile-dashboard" aria-label="Course dashboard">
                <ProfileOverview
                  bioDraft={bioDraft}
                  bioError={bioError}
                  isBioEditing={isBioEditing}
                  isBioSaving={isBioSaving}
                  onBioCancel={cancelBioEdit}
                  onBioDraftChange={setBioDraft}
                  onBioEdit={startBioEdit}
                  onBioSave={saveBio}
                  summary={summary}
                />
                <ProfileCourseProgress
                  error={error}
                  isLoading={isProgressLoading}
                  items={progresses}
                  summary={summary}
                />
                <ProfileStats summary={summary} />
                <ProfileBadges />
                <ProfileRecentActivity summary={summary} />
              </section>
            </section>
          ) : null}
        </div>
      </main>
      <GithubFooter />
    </div>
  );
}
