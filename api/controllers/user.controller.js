import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.send({ message: "Hello from user routes" });
};

// user update api
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(
        errorHandler(403, "You are not allowed to update this user!")
      );
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.userName) {
      if (req.body.userName.length < 7 || req.body.userName.length > 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters")
        );
      }
      if (req.body.userName.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.userName !== req.body.userName.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"));
      }
      if (!/^[a-zA-Z0-9]+$/.test(req.body.userName)) {
        return next(
          errorHandler(400, "Username can only contain letters and numbers")
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// user delete api

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this account")
    );
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

// user sign out api

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("SignOut Successful");
  } catch (error) {
    next(error);
  }
};

// get users

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You Are Not Allowed To See All Users"));
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully",
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
