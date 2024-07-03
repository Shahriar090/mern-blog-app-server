import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
const postRoute = express.Router();

postRoute.post("/create-post", verifyToken, createPost);
postRoute.get("/getposts", getPosts);
postRoute.delete("/deletepost/:postId/:userId", verifyToken, deletePost);
postRoute.put("/updatepost/:postId/:userId", verifyToken, updatePost);

export default postRoute;
