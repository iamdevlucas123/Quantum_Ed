import app from './app';
import { env } from './config/env'
import { refreshTokenCleanupJob } from './services/jobs/refresh_token_cleanup_job';
import { welcomeEmailJob } from './services/jobs/welcome_email_job';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  refreshTokenCleanupJob.start();
  welcomeEmailJob.start();
});
