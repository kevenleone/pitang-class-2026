import './queues/register-email.worker';

import { loggerWorker } from './core/Logger';

loggerWorker.info('Running and waiting for jobs...');
