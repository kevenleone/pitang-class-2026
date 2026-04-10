import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import userRouter from "./http/routes/user.route";
import { environment } from "./core/EnvVars";
import { errorFallbackMiddleware } from "./http/middlewares/error.fallback.middleware";
import { authMiddleware } from "./http/middlewares/auth.middleware";
import { postRouter } from "./http/routes/post.route";

const PORT = environment.HTTP_PORT;

const app = express();

app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  }),
);
app.use(morgan("dev"));
app.use(helmet());
app.use(authMiddleware);

app.get("/", (request, response) => {
  response.send({ message: "Hello world" });
});

app.use("/api", userRouter);
app.use("/api", postRouter);

app.use(errorFallbackMiddleware);

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
