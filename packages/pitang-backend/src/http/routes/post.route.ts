import express from 'express';

import {
    deletePost,
    getPost,
    getPosts,
    patchPost,
    postPost,
} from '../controllers/post.controller';

const postRouter = express.Router();

postRouter.get('/post', getPosts);
postRouter.get('/post/:slug', getPost);
postRouter.post('/post', postPost);
postRouter.patch('/post/:slug', patchPost);
postRouter.delete('/post/:slug', deletePost);

export { postRouter };
