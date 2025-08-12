// backend/routes/notificationRoutes.js
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  fetchNotifications,
  markOneAsRead,
  markAllAsRead
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyToken, fetchNotifications);
router.patch('/:id/read', verifyToken, markOneAsRead);
router.patch('/all/read', verifyToken, markAllAsRead);

export default router;
