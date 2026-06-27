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
        origin: (origin, callback) => {
            const allowedOrigins = [
                process.env.WEB_URL,
                process.env.APP_URL
            ];

            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS."));
        },
        credentials: true
    })
);
app.use(express.urlencoded({
    extended: true
}));

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
import errorHandler from "./middlewares/response.middleware";


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/oauth", githubRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);
app.use("/api/v1/contests", contestRoutes);

app.use(errorHandler)

export default app;