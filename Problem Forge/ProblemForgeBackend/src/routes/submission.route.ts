import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {getMySubmissions, getSubmission, runProblem, submitProblem } from "../controllers/submission.controller";

const router = Router()

router.post("/submit-problem",verifyJWT,submitProblem)
router.post("/run-problem",verifyJWT,runProblem)
router.get("/get-submission/:submissionId",verifyJWT,getSubmission)
router.get("/get-my-submissions",verifyJWT,getMySubmissions)

export default router;