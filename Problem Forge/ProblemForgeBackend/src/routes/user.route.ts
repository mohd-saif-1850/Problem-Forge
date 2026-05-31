import { Router } from "express";
import {
    registerUser,
    verifyEmail,
    getCurrentUser
} from "../controllers/user.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.post("/register-email", registerUser);
router.post("/verify-email", verifyEmail);
router.get("/me",verifyJWT,getCurrentUser);

export default router;