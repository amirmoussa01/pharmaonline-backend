import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadMessages,
  getAdminsForMessaging,
  getUsersForAdmin
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage); // Envoyer un message
router.get('/conversation/:withUser', verifyToken, getConversation); // Messages entre 2 utilisateurs
router.get('/non-lus', verifyToken, getUnreadMessages); // Tous les messages non lus
router.patch('/:id/lu', verifyToken, markAsRead); // Marquer un message comme lu
router.get('/admins', verifyToken, getAdminsForMessaging);
router.get('/utilisateurs', verifyToken, getUsersForAdmin);

export default router;
