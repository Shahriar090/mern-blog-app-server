import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost } from "../controllers/post.controller.js";
const postRoute = express.Router();

postRoute.post("/create-post", verifyToken, createPost);

export default postRoute;
