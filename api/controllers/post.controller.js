import { Post } from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
export const createPost = async (req, res, next) => {
  try {
    // checking if the user is not admin
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You Are Not Allowed To Create A Post"));
      //   checking if the title and content fields are empty
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please Provide All Required Fields"));
    }
    // slug for better SEO performance
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    //   creating new post
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(201).json({
      success: true,
      message: "Post Created Successfully",
      savedPost,
    });
  } catch (error) {
    next(error);
  }
};
