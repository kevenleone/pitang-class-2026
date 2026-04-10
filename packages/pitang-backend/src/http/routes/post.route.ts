import express from "express";

import { getPost, getPosts, postPost } from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.get("/post", getPosts);
postRouter.get("/post/:slug", getPost);
postRouter.post("/post", postPost);

export { postRouter };
