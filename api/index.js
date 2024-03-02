import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 5000;

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

// middleware
app.use(express.json());

// mongo db url
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.caldhyv.mongodb.net/shahriar's-blog?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("MongoDb Connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });

//   all routes

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// testing api
app.listen(PORT, () => {
  console.log(`Mern blog server is running on port: ${PORT}`);
});
