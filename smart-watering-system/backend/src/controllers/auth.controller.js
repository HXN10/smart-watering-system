const User = require("../models/User.model");

exports.getUsers = async () => {
  const dbUsers = await User.find({}, { password: 0 });
  const safeUsers = {};
  dbUsers.forEach(user => {
    safeUsers[user.email] = { email: user.email, hasPassword: true };
  });
  return safeUsers;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && user.password === password) {
      return res.json({
        token: `token-${user.email}-${Date.now()}`,
        user: { email: user.email },
      });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    return res.status(201).json({
      token: `token-${user.email}-${Date.now()}`,
      user: { email: user.email },
      message: "Account created successfully"
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
  