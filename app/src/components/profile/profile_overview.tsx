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

const BIO_MAX_LENGTH = 280;

export default function ProfileOverview({
  bioDraft,
  bioError,
  isBioEditing,
  isBioSaving,
  onBioCancel,
  onBioDraftChange,
  onBioEdit,
  onBioSave,
  summary,
}: ProfileOverviewProps) {
  const remainingCharacters = BIO_MAX_LENGTH - bioDraft.length;

  return (
    <>
      <section className="profile-main-grid">
        <article className="profile-card profile-card--journey">
          <div className="profile-card__header">
            <h2>About / Learning Journey</h2>
          </div>
          {isBioEditing ? (
            <div className="profile-bio-editor">
              <textarea
                aria-label="Profile bio"
                maxLength={BIO_MAX_LENGTH}
                onChange={(event) => onBioDraftChange(event.target.value)}
                value={bioDraft}
              />
              <div className="profile-bio-editor__meta">
                <span>{remainingCharacters} characters left</span>
                {bioError ? <strong>{bioError}</strong> : null}
              </div>
              <div className="profile-bio-editor__actions">
                <button className="profile-card__button" disabled={isBioSaving} onClick={onBioSave} type="button">
                  {isBioSaving ? 'Saving...' : 'Save'}
                </button>
                <button className="profile-card__button profile-card__button--ghost" disabled={isBioSaving} onClick={onBioCancel} type="button">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p>{summary.userDescription}</p>
              {bioError ? <p className="profile-bio-editor__error">{bioError}</p> : null}
              <button className="profile-card__button" onClick={onBioEdit} type="button">
                Update Bio
              </button>
            </>
          )}
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
