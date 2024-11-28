// routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authUser, getUserProfile);
router.put('/profile', authUser, updateUserProfile);

export default router;