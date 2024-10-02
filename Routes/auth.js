const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const router = express.Router();

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email_id: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  Password: { type: String, required: true },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// User Registration Route
router.post("/register", async (req, res) => {
  const { Name, Email_id, number, Password } = req.body;

  try {
    const existingUser = await User.findOne({ Email_id });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password.trim(), 10);

    const newUser = new User({
      Name,
      Email_id,
      number,
      Password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  const { Email_id, Password } = req.body;

  try {
    const user = await User.findOne({ Email_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password.trim(), user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get User Data Route
router.post('/user', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ Email_id: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { Name, profilePhoto, bio } = user;
    res.json({ Name, profilePhoto, bio });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
