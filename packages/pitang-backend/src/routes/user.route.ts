import express from "express";

import crypto from "node:crypto";

const userRouter = express.Router();

let users = [] as {
  id: string;
  name: string;
  username: string;
}[];

userRouter.get("/users", (request, response) => response.json(users));

userRouter.get("/users/:id", (request, response) => {
  const id = request.params.id;

  const user = users.find((user) => user.id === id);

  if (!user) {
    return response.status(404).json({ message: "User not exists" });
  }

  response.json(user);
});

userRouter.post("/users", (request, response) => {
  const body = request.body;

  const user = {
    id: crypto.randomUUID(),
    name: body.name,
    username: body.username,
  };

  users.push(user);

  response.status(201).json(user);
});

userRouter.put("/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  users = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        name: body.name,
        username: body.username,
      };
    }

    return user;
  });

  response.json(users);
});

userRouter.delete("/users/:id", (request, response) => {
  users = users.filter((user) => user.id !== request.params.id);

  response.status(204).send();
});

export default userRouter;
