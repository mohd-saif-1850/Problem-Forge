import { Router } from "express";
import {
    registerUser,
    verifyEmail,
    logoutUser,
    login,
    verifyTwoStepVerification,
    getCurrentUser,
    toggleTwoStepVerification,
    verifyTwoStepVerificationToggle,
    changeProfilePicture
} from "../controllers/user.controller";
import verifyJWT from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.post("/register-email", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/logout", verifyJWT,logoutUser);
router.post("/login",login);
router.post("/verify-two-step-verification",verifyTwoStepVerification);
router.post("/toggle-two-step-verification",verifyJWT,toggleTwoStepVerification)
router.post("/verify-toggle-two-step-verification",verifyJWT,verifyTwoStepVerificationToggle)

router.get("/me",verifyJWT,getCurrentUser)

router.patch("/change-profile-picture",verifyJWT,upload.single("profilePicture"),changeProfilePicture)

export default router;
