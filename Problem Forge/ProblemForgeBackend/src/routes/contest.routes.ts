import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { cancelContest, createContest, deleteContest, filterContests, getAllContests, getContest, getContestLeaderboard, getMyContests, registerContest, submitContest, updateContest } from "../controllers/contest.controller";

const router = Router()

router.post("/create-contest",verifyJWT,createContest)
router.post("/register-contest/:contestId",verifyJWT,registerContest)
router.post("/submit-contest/:contestId",verifyJWT,submitContest)
router.get("/get-contest-leaderboard/:contestId",verifyJWT,getContestLeaderboard)
router.post("/cancel-contest/:contestId",verifyJWT,cancelContest)
router.delete("/delete-contest/:contestId",verifyJWT,deleteContest)
router.get("/get-my-contests",verifyJWT,getMyContests)
router.get("/get-all-contests",verifyJWT,getAllContests)
router.get("/get-filter-contests",verifyJWT,filterContests)
router.get("/get-contest/:contestId",verifyJWT,getContest)
router.patch("/update-contest/:contestId",verifyJWT,updateContest)

export default router;