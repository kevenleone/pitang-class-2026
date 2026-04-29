import { app } from './app';
import { environment } from './core/EnvVars';
import { logger } from './core/Logger';

const PORT = environment.HTTP_PORT;

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
