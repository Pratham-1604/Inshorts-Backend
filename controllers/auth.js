const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = {
  register,
  login,
};
