import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/user.route";

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

app.use("/api", userRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello world" });
});

app.listen(3333, () => {
  console.log("Running on PORT 3333");
});
