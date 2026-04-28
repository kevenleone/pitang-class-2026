import { loggerWorker } from './core/Logger';

import './queues/register-email.worker';

loggerWorker.info('Running and waiting for jobs...');
