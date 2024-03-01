const express = require("express");
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Hello from server side of mern blog app");
});

app.listen(PORT, () => {
  console.log(`Mern blog server is running on port: ${PORT}`);
});
