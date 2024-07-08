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
    const present = new Date();
    const oneWeekAgo = new Date(present - 7 * 24 * 60 * 60 * 1000);

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

    let trendingPosts = [];
    if (req.query.trending === "true") {
      trendingPosts = await Post.find({ createdAt: { $gte: oneWeekAgo } })
        .sort({ minutesRead: -1, likes: -1 })
        .limit(10);
    }

    res.status(200).json({
      success: true,
      message: "Posts Retrieved Successfully",
      posts,
      totalPosts,
      lastMonthsPosts,
      trendingPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
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

// update post

export const updatePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You Are Not Allowed To Update This Post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

//total minutes count route
export const incrementMinutesRead = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { minutes } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    post.minutesRead += minutes;
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post minutes read incremented",
      minutesRead: post.minutesRead,
    });
  } catch (error) {
    next(error);
  }
};

// total likes count route

export const likePost = async (req, res, next) => {
  try {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return next(errorHandler(404, "Post not found"));
      }

      post.likes += 1;
      await post.save();

      res.status(200).json({
        success: true,
        message: "Post liked",
        likes: post.likes,
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
