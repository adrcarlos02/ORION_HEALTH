// routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser, // Ensure you import logoutUser if not already
} from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/upload.js'; // Import the upload middleware

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authUser, getUserProfile);
router.put('/profile', authUser, upload.single('image'), updateUserProfile); // Use upload.single for image
router.post('/logout', authUser, logoutUser); //

export default router;