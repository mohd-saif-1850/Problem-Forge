import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { runProblem, submitProblem } from "../controllers/submission.controller";

const router = Router()

router.post("/submit-problem",verifyJWT,submitProblem)
router.post("/run-problem",verifyJWT,runProblem)

export default router;