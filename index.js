const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const PORT = 5000;

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

//   testing routes

app.get("/", (req, res) => {
  res.send("Hello from server side of mern blog app");
});

app.listen(PORT, () => {
  console.log(`Mern blog server is running on port: ${PORT}`);
});

// mern-blog-user
// 3lsXOdWMp7RiG0g3
