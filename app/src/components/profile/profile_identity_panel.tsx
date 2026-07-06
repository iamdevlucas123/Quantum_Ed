import { useRef, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Profile summary">
      <Card>
        <CardContent className="grid gap-5 pt-0">
      <div className="relative mx-auto size-28">
        {user.avatarUrl ? (
          <img className="size-28 rounded-full border object-cover" src={user.avatarUrl} alt={`${displayName} profile`} />
        ) : (
          <div className="grid size-28 place-items-center rounded-full border bg-muted text-4xl font-semibold" aria-hidden="true">{initial}</div>
        )}
        <Button
          aria-label="Upload profile photo"
          className="absolute bottom-0 right-0 rounded-full"
          size="icon-sm"
          disabled={isAvatarSaving}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span aria-hidden="true">+</span>
        </Button>
        <input
          accept="image/*"
          className="sr-only"
          data-testid="profile-avatar-input"
          disabled={isAvatarSaving}
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
      </div>
      {avatarError ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{avatarError}</p> : null}
      {isAvatarSaving ? <p className="text-center text-sm text-muted-foreground">Saving photo...</p> : null}

      <div className="text-center">
        <h1 className="break-words text-2xl font-semibold tracking-normal">{displayName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">@{summary.username}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{summary.userDescription}</p>
      </div>

      <div className="grid grid-cols-3 gap-2" aria-label="Profile quick stats">
        {sidebarStats(summary).map((item) => (
          <article className="rounded-lg border bg-background p-3 text-center" key={item.label}>
            <strong className="block text-lg">{item.value}</strong>
            <span className="mt-1 block text-xs text-muted-foreground">{item.label}</span>
          </article>
        ))}
      </div>

      <dl className="grid gap-3">
        {infoRows(summary).map((item) => (
          <div className="flex items-center justify-between gap-3 border-b pb-3 text-sm last:border-b-0 last:pb-0" key={item.label}>
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="text-right font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
        </CardContent>
      </Card>
    </aside>
  );
}
