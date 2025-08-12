import express from 'express';
import {
  listerToutesLesCommandes,
  changerStatutCommande
} from '../controllers/adminCommandesController.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/commandes', verifyToken, verifyAdmin, listerToutesLesCommandes);
router.patch('/commandes/:id_commande', verifyToken, verifyAdmin, changerStatutCommande);

export default router;
