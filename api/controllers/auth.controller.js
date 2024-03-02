import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "Please fill the required fields"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.send("Sign Up Successful");
  } catch (error) {
    next(error);
  }
};
