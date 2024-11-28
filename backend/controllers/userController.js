// controllers/userController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model defined

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate a token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Log in an existing user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required.' });
    }

    // Find the user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Get the user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the middleware

    // Find the user
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Update the user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the middleware
    const { name, phone, address, dob, gender } = req.body;

    // Update the user
    await User.update(
      { name, phone, address, dob, gender },
      { where: { id: userId } }
    );

    res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};