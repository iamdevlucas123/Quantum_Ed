import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileRecentActivityProps } from './profile_types';

export default function ProfileRecentActivity({ summary }: ProfileRecentActivityProps) {
  return (
    <Card id="profile-activity">
      <CardHeader className="sm:flex sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <a className="text-sm font-medium underline-offset-4 hover:underline" href="#profile-activity">View all activity</a>
      </CardHeader>

      <CardContent>
      <div className="grid gap-3">
        {summary.recentActivity.map((item) => (
          <article className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border bg-background p-3" key={item.id}>
            <span className="grid size-7 place-items-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground" aria-hidden="true">+</span>
            <p className="text-sm">{item.label}</p>
            <time className="text-xs text-muted-foreground">{item.timeLabel}</time>
          </article>
        ))}
      </div>
      </CardContent>
    </Card>
  );
}
