import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { createFeedback, getAllFeedback, getFeedback, getMyFeedback, updateFeedback } from "../controllers/feedback.controller";

const router = Router()

router.post("/create-feedback",verifyJWT,createFeedback)
router.patch("/update-feedback/:feedbackId",verifyJWT,updateFeedback)
router.get("/get-feedback/:feedbackId",verifyJWT,getFeedback)
router.get("/get-my-feedbacks",verifyJWT,getMyFeedback)
router.get("/get-all-feedbacks",verifyJWT,getAllFeedback)

export default router;