import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
const commentRoute = express.Router();
commentRoute.post("/create", verifyToken, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);
commentRoute.put("/likeComment/:commentId", verifyToken, likeComment);

export default commentRoute;
