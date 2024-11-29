// controllers/userController.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model defined
import dotenv from 'dotenv';
import { uploadToCloudinary } from '../utils/cloudinary.js'; // Utility for Cloudinary uploads

dotenv.config();

/**
 * Register a new user.
 */
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

    // Set the token in an HTTP-only cookie
    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false in development
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Fetch all user details excluding password
    const fullUser = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: fullUser, // Send the full user object
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

/**
 * Log in an existing user.
 */
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

    // Set the token in an HTTP-only cookie
    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false in development
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Fetch all user details excluding password
    const fullUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: fullUser, // Send the full user object
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

/**
 * Get the user's profile.
 */
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

/**
 * Update the user's profile.
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the middleware
    const { name, phone, address, dob, gender } = req.body;

    console.log('User ID:', userId);
    console.log('Request Body:', req.body);

    let imageUrl = null;

    // Check if an image is uploaded
    if (req.file) {
      try {
        // Upload the image buffer to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer, 'profile_images');
        imageUrl = result.secure_url;
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Image upload failed.' });
      }
    }

    // Parse address if it's a string (since it's sent as JSON in FormData)
    let parsedAddress = {};
    if (typeof address === 'string') {
      try {
        parsedAddress = JSON.parse(address);
      } catch (parseError) {
        console.error('Address parsing error:', parseError);
        return res.status(400).json({ success: false, message: 'Invalid address format.' });
      }
    } else {
      parsedAddress = address;
    }

    // Prepare the update data
    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Update the user
    const [updatedRows] = await User.update(updateData, { where: { id: userId } });

    console.log('Number of rows updated:', updatedRows);

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fetch the updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    console.log('Updated User:', updatedUser); // Add this line

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser, // Send the updated user data back to the frontend
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

/**
 * Log out the user by clearing the JWT cookie.
 */
export const logoutUser = async (req, res) => {
  try {
    res.cookie('jwtToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false in development
      sameSite: 'Strict',
      expires: new Date(0), // Expire the cookie immediately
    });
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};