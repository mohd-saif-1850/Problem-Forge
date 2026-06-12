import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.get("/", (req, res) => {
  res.send("Problem Forge is Active");
});

//Routing
import userRoutes from "./routes/user.route";
import githubRoutes from "./routes/github.route"
import problemRoutes from "./routes/problem.route"

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/oauth", githubRoutes);
app.use("/api/v1/problems", problemRoutes);

export default app;