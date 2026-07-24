import express from 'express';
import { toggleBookmark, getSavedPosts } from '../controllers/bookmarkController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/:postId', toggleBookmark);
router.get('/', getSavedPosts);

export default router;
