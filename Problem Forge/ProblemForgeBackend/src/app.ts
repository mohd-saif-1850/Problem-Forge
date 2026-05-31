import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Problem Forge is Active");
});

//Routing
import userRouter from "./routes/user.route";

app.use("/api/v1/users", userRouter);

export default app;