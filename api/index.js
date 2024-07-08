import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = 6000;

const corsOptions = {
  origin: ["http://localhost:5173", "https://wander-words.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
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
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

// middleware for error handling

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// testing api
app.get("/", async (req, res) => {
  res.send("Mern Blog Server Is Running Smoothly");
});
app.listen(PORT, () => {
  console.log(`Mern blog server is running on port: ${PORT}`);
});
