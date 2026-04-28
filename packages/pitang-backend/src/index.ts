import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './core/EnvVars';
import { logger } from './core/Logger';
import { authMiddleware } from './http/middlewares/auth.middleware';
import { errorFallbackMiddleware } from './http/middlewares/error.fallback.middleware';
import { postRouter } from './http/routes/post.route';
import userRouter from './http/routes/user.route';
import { registerMailQueue } from './queues/register.mail.queue';

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(registerMailQueue)],
    serverAdapter,
});

const PORT = environment.HTTP_PORT;

const app = express();

app.use(express.json());

app.use(
    cors({
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        origin: '*',
    }),
);
app.use(morgan('dev'));
app.use(helmet());
app.use(authMiddleware);

app.get('/', (request, response) => {
    response.send({ message: 'Hello world' });
});

app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/admin/queues', serverAdapter.getRouter());

app.use(errorFallbackMiddleware);

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
