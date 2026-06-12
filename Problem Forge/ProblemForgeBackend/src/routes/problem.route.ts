import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { createProblem, getProblem } from "../controllers/problem.controller";

const router = Router()

router.post("/create-problem",verifyJWT,createProblem)
router.get("/get-problem",getProblem)

export default router;