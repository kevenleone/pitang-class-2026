import express from 'express';

import { Role } from '../../generated/prisma/enums';
import {
    deleteUser,
    getUser,
    getUsers,
    login,
    patchUser,
    postUser,
} from '../controllers/user.controller';
import { roleRestrictedMiddleware } from '../middlewares/role.restricted.middleware';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.get('/users', roleRestrictedMiddleware([Role.ADMIN]), getUsers);
userRouter.get('/users/:id', roleRestrictedMiddleware([Role.ADMIN]), getUser);
userRouter.post('/users', postUser);
userRouter.patch(
    '/users/:id',
    roleRestrictedMiddleware([Role.ADMIN, Role.COLLABORATOR, Role.USER]),
    patchUser,
);
userRouter.delete(
    '/users/:id',
    roleRestrictedMiddleware([Role.ADMIN]),
    deleteUser,
);

export default userRouter;
