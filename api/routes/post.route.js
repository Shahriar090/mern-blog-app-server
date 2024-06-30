import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";
const postRoute = express.Router();

postRoute.post("/create-post", verifyToken, createPost);
postRoute.get("/getposts", getPosts);
postRoute.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

export default postRoute;
