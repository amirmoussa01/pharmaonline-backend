// routes/adminRoutes.js
import express from 'express';
import { getAdminStats, getCommandesByDayController } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats); 
router.get('/commandes-by-day', getCommandesByDayController);

export default router;
