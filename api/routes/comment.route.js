import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
const commentRoute = express.Router();
commentRoute.post("/create", verifyToken, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);
commentRoute.put("/likeComment/:commentId", verifyToken, likeComment);
commentRoute.put("/editComment/:commentId", verifyToken, editComment);
commentRoute.delete("/deleteComment/:commentId", verifyToken, deleteComment);
commentRoute.get("/getComments", verifyToken, getComments);

export default commentRoute;
