import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  likeUnlikePost,
  deletePost,
  getTrendingHashtags,
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/hashtags/trending', getTrendingHashtags);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getPostById);
router.post('/:id/like', likeUnlikePost);
router.delete('/:id', deletePost);

export default router;
