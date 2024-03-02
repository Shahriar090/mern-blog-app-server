import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;

  if (
    !userName ||
    !email ||
    !password ||
    userName === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "Please fill the required fields" });
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
    res.status(500).json({ message: error.message });
  }
};
