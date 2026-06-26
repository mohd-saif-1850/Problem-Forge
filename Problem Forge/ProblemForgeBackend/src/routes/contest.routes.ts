import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { createContest, getContestLeaderboard, registerContest, submitContest } from "../controllers/contest.controller";

const router = Router()

router.post("/create-contest",verifyJWT,createContest)
router.post("/register-contest/:contestId",verifyJWT,registerContest)
router.post("/submit-contest/:contestId",verifyJWT,submitContest)
router.get("/get-contest-leaderboard/:contestId",verifyJWT,getContestLeaderboard)

export default router;