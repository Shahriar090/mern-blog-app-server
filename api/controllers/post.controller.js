import { Post } from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

// create post
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

// get posts

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchItem) {
      query.$or = [
        { title: { $regex: req.query.searchItem, $options: "i" } },
        { content: { $regex: req.query.searchItem, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthsPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      message: "Posts Retrieved Successfully",
      posts,
      totalPosts,
      lastMonthsPosts,
    });
  } catch (error) {
    next(error);
  }
};

// delete a post

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You Are Not Allowed To Delete This Post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
