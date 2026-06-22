import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { submitProblem } from "../controllers/submission.controller";

const router = Router()

router.post("/submit-problem",verifyJWT,submitProblem)

export default router;