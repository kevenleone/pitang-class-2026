import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import userRouter from "./routes/user.route";
import { environment } from "./core/EnvVars";

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

app.get("/", (request, response) => {
  response.send({ message: "Hello world" });
});

app.use("/api", userRouter);

app.use((err, request, response, next) => {
  console.error(err.stack);

  if (environment.NODE_ENV === "development") {
    return response
      .status(400)
      .json({ message: "Something went wrong", stack: err });
  }

  response.status(400).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
