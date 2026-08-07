const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const trimmedUsername = username.trim();

    // Find user by username
    const user = await User.findOne({ where: { username: trimmedUsername } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// PUT /api/auth/reset
exports.resetCredentials = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const trimmedUsername = username.trim();

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // Check if new username is already taken by another user
    if (trimmedUsername !== user.username) {
      const existingUser = await User.findOne({ where: { username: trimmedUsername } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.username = trimmedUsername;
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Credentials updated successfully. Please log in again.' });
  } catch (error) {
    console.error('Reset credentials error:', error);
    res.status(500).json({ message: 'Server error during credentials reset.' });
  }
};
