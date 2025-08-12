import express from 'express';
import { getUserDashboardStats } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getUserDashboardStats);

export default router;
