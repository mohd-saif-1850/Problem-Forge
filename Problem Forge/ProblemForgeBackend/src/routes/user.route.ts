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
    changeProfilePicture,
    changeName,
    changeUsername,
    changeBio,
    forgotPassword,
    resetPassword,
    toggleTimer,
    preferredLanguage,
    addEmail,
    verifyAddEmail
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
router.patch("/change-name",verifyJWT, changeName),
router.patch("/change-username",verifyJWT, changeUsername),
router.patch("/change-bio",verifyJWT, changeBio)

// Password
router.post("/forgot-password",forgotPassword),
router.patch("/reset-password/:token",resetPassword)

router.patch("/toggle-timer",verifyJWT,toggleTimer)
router.patch("/change-preferred-language",verifyJWT,preferredLanguage)

// After oAuth
router.post("/add-email",verifyJWT,addEmail)
router.patch("/verify-add-email",verifyJWT,verifyAddEmail)

export default router;
