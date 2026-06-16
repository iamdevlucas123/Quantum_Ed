import { prisma } from '../../config/prisma';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const RETENTION_WINDOW_IN_MS = 30 * ONE_DAY_IN_MS;

class RefreshTokenCleanupJob {
  private hasStarted = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    void this.run();

    this.timer = setInterval(() => {
      void this.run();
    }, ONE_DAY_IN_MS);
  }

  async run(): Promise<void> {
    const retentionCutoff = new Date(Date.now() - RETENTION_WINDOW_IN_MS);

    try {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: retentionCutoff } },
            { revokedAt: { lt: retentionCutoff } },
          ],
        },
      });

      if (result.count > 0) {
        console.log(`[jobs] refresh token cleanup removed ${result.count} tokens`);
      }
    } catch (error) {
      console.error('[jobs] refresh token cleanup failed', error);
    }
  }
}

export const refreshTokenCleanupJob = new RefreshTokenCleanupJob();
