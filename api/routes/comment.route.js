import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
const commentRoute = express.Router();
commentRoute.post("/create", verifyToken, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);
commentRoute.put("/likeComment/:commentId", verifyToken, likeComment);
commentRoute.put("/editComment/:commentId", verifyToken, editComment);
commentRoute.put("/deleteComment/:commentId", verifyToken, deleteComment);

export default commentRoute;
