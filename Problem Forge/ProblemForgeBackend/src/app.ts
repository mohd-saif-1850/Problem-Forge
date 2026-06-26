import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

// Cron
import "./cron/index"

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
import submissionRoutes from "./routes/submission.route"
import commentRoutes from "./routes/comment.route"
import feedbackRoutes from "./routes/feedback.route"
import contestRoutes from "./routes/contest.routes"

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/oauth", githubRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);
app.use("/api/v1/contests", contestRoutes);


export default app;