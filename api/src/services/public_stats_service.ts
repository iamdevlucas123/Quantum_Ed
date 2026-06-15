import { prisma } from '../config/prisma';

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

class PublicStatsService {
  private developerCount = 0;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private hasStarted = false;

  async start(): Promise<void> {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    await this.refreshDeveloperCount();

    this.refreshTimer = setInterval(() => {
      void this.refreshDeveloperCount();
    }, ONE_HOUR_IN_MS);
  }

  getDeveloperCount(): number {
    return this.developerCount;
  }

  private async refreshDeveloperCount(): Promise<void> {
    this.developerCount = await prisma.user.count();
  }
}

export const publicStatsService = new PublicStatsService();
