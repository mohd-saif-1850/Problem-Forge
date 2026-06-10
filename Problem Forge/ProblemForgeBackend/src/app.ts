import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Problem Forge is Active");
});

//Routing
import userRoutes from "./routes/user.route";
import githubRoutes from "./routes/github.route"

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/oauth", githubRoutes);

export default app;