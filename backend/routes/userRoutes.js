import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  searchUsers,
  getSuggestedUsers,
  logoutUser,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect);
router.get('/me', getCurrentUser);
router.get('/profile/:username', getUserProfile);
router.put(
  '/profile',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'coverPic', maxCount: 1 },
  ]),
  updateUserProfile
);
router.post('/follow/:id', followUnfollowUser);
router.get('/search', searchUsers);
router.get('/suggested', getSuggestedUsers);
router.post('/logout', logoutUser);

export default router;
