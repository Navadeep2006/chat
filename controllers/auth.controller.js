const jwt = require("jsonwebtoken");
const { findUserByEmail, findUserByIdentifier, users } = require("../store");

exports.register = async (req, res) => {
  // Registration disabled for the demo-only, two-user setup
  return res.status(403).json({ message: "Registration is disabled for this demo" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = user.password === password;
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = findUserByIdentifier(identifier);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
    