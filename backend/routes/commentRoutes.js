import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/:postId', addComment);
router.get('/:postId', getPostComments);
router.delete('/:id', deleteComment);

export default router;
