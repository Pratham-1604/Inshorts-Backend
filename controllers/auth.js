const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username,
      email: email,
      password: passwordHash,
    });

    res.status(200).json({
      status: "Account Created Successfully!",
      user_id: newUser.id,
    });
  } catch (err) {
    res.status(500).json({
      status: "An error occurred! Could not create Account!",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user.id }, "ABCD", {
      expiresIn: "100h",
    });

    res.status(200).json({
      status: "Login successful",
      user_id: user.id,
      access_token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: "User already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const apiKey = crypto.randomBytes(32).toString("hex");

    const newAdmin = await User.create({
      username,
      email,
      password: passwordHash,
      isAdmin: true,
      apiKey,
    });

    res.status(201).json({
      status: "Admin user created successfully!",
      user_id: newAdmin.id,
      api_key: apiKey, // Optionally return the API key
    });
  } catch (err) {
    res.status(500).json({
      status: "An error occurred! Could not create admin user!",
      error: err.message,
    });
  }
};

const getApiKey = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials!" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ msg: "Unauthorized access. Admin only!" });
    }

    res.status(200).json({
      status: "API key retrieved successfully!",
      api_key: user.apiKey,
    });
  } catch (err) {
    res.status(500).json({
      status: "An error occurred! Could not retrieve API key!",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getApiKey,
  createAdminUser,
};
