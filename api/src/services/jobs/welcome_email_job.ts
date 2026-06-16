const ONE_MINUTE_IN_MS = 60 * 1000;

class WelcomeEmailJob {
  private hasStarted = false;
  private dependencyNoticePrinted = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    this.run();

    this.timer = setInterval(() => {
      this.run();
    }, ONE_MINUTE_IN_MS);
  }

  run(): void {
    if (this.dependencyNoticePrinted) {
      return;
    }

    this.dependencyNoticePrinted = true;
    console.log(
      '[jobs] welcome email job is inactive: email infrastructure and persisted pending email queue are not identified in the current project.',
    );
  }
}

export const welcomeEmailJob = new WelcomeEmailJob();
