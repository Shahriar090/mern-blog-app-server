import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, getPosts } from "../controllers/post.controller.js";
const postRoute = express.Router();

postRoute.post("/create-post", verifyToken, createPost);
postRoute.get("/getposts", getPosts);

export default postRoute;
