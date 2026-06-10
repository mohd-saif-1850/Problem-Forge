import { Router } from "express";
import { githubCallback, githubLogin } from "../controllers/github.controller";

const router = Router()

router.post("/github-login",githubLogin)
router.post("/github-callback",githubCallback)

export default router;