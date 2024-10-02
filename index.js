const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/auth");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

mongoose
  .connect("mongodb://localhost:27017/AuthDB")
  .then(() => console.log("Connected to AuthDB"))
  .catch((err) => console.error("Failed to connect to AuthDB", err));

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
