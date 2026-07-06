import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileHeroProps } from './profile_types';

export default function ProfileHero({ isAuthenticated, isLoading, onRequestLogin }: ProfileHeroProps) {
  return (
    <>
      {!isAuthenticated && !isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Authentication required</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">Sign in to see your learning dashboard, courses, streak, study activity and earned badges.</p>
          <Button className="w-fit" type="button" onClick={onRequestLogin}>
            Open login
          </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
