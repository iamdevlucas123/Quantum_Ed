import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>About / Learning Journey</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
          {isBioEditing ? (
            <div className="grid gap-3">
              <textarea
                className="min-h-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                aria-label="Profile bio"
                maxLength={BIO_MAX_LENGTH}
                onChange={(event) => onBioDraftChange(event.target.value)}
                value={bioDraft}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>{remainingCharacters} characters left</span>
                {bioError ? <strong className="text-destructive">{bioError}</strong> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled={isBioSaving} onClick={onBioSave} type="button">
                  {isBioSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" disabled={isBioSaving} onClick={onBioCancel} type="button">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-6 text-muted-foreground">{summary.userDescription}</p>
              {bioError ? <p className="text-sm text-destructive">{bioError}</p> : null}
              <Button className="w-fit" onClick={onBioEdit} type="button">
                Update Bio
              </Button>
            </>
          )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Learning Streak</CardTitle>
            </CardHeader>
            <CardContent>
            <div>
              <strong className="text-3xl">{summary.streakDays}</strong>
              <span className="ml-2 text-sm text-muted-foreground">days</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{streakCaption(summary.streakDays)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hours Studied</CardTitle>
            </CardHeader>
            <CardContent>
            <div>
              <strong className="text-3xl">{summary.estimatedStudyHours}</strong>
              <span className="ml-2 text-sm text-muted-foreground">hrs</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">+{summary.weeklyHoursStudied} hrs this week</p>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="h-3 overflow-hidden rounded-full bg-muted" aria-label={`${summary.averageProgress}% of learning journey completed`}>
              <span className="block h-full rounded-full bg-primary" style={{ width: `${summary.averageProgress}%` }} />
            </div>
            <p className="text-sm text-muted-foreground">{summary.averageProgress}% of learning journey completed</p>
            <a className="text-sm font-medium underline-offset-4 hover:underline" href="#profile-courses">View full progress</a>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
