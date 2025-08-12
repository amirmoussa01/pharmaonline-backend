import express from 'express';
import {
  creerPaiement,
  getMesPaiements,
  getTousPaiements,
  getPaiement
} from '../controllers/paiementController.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, creerPaiement);
router.get('/me', verifyToken, getMesPaiements);
router.get('/', verifyToken, verifyAdmin, getTousPaiements);
router.get('/:id', verifyToken, getPaiement);

export default router;
