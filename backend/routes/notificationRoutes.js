import express from 'express';
import {
  getNotifications,
  markNotificationsRead,
  clearNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read', markNotificationsRead);
router.delete('/', clearNotifications);

export default router;
