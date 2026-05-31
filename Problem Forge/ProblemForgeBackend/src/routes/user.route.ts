import { Router } from "express";
import {
    registerUser,
    verifyEmail
} from "../controllers/user.controller";

const router = Router();

router.post("/register-email", registerUser);
router.post("/verify-email", verifyEmail);

export default router;