import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { createComment, getCommentLikes, getCommentReplies, getMyComments, getProblemComments, toggleCommentLike } from "../controllers/comment.controller";

const router = Router()

router.post("/create-comment",verifyJWT,createComment)
router.post("/get-problem-comments",verifyJWT,getProblemComments)
router.post("/get-my-comments",verifyJWT,getMyComments)
router.post("/get-comment-replies",verifyJWT,getCommentReplies)

router.post("/toggle-comment-like",verifyJWT,toggleCommentLike)

router.post("/get-comment-likes",verifyJWT,getCommentLikes)

export default router;