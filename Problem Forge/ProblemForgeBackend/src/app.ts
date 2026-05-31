import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Problem Forge is Active");
});

//Routing
import userRouter from "./routes/user.route";

app.use("/api/v1/users", userRouter);

export default app;