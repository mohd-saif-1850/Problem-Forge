import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { createProblem, deleteProblem, getAllProblems, getCurrentProblem, getMainProblems, getMyProblems, searchProblems, updateProblem } from "../controllers/problem.controller";

const router = Router()

router.post("/create-problem",verifyJWT,createProblem)
router.patch("/update-problem/:problemId",verifyJWT,updateProblem)
router.get("/get-current-problem/:slug",verifyJWT,getCurrentProblem)
router.delete("/delete-problem/:problemId",verifyJWT,deleteProblem)

router.get("/search-problems",verifyJWT,searchProblems)
router.get("/get-all-problems",verifyJWT,getAllProblems)
router.get("/get-main-problems",verifyJWT,getMainProblems)
router.get("/get-my-problems",verifyJWT,getMyProblems)

export default router;