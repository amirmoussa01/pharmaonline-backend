import express from 'express';
import {
  commanderProduit,
  listerCommandesUtilisateur,
  detailsCommande,
  modifierLigneCommande,
  supprimerLigneCommande,
  annulerCommandeController
} from '../controllers/commandeController.js';

import { verifyToken,verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/commander', verifyToken, commanderProduit);
router.get('/mes-commandes', verifyToken, listerCommandesUtilisateur);
router.get('/:id', verifyToken, detailsCommande);
router.put('/ligne/:id_ligne', verifyToken, modifierLigneCommande);
router.delete('/ligne/:id_ligne', verifyToken, supprimerLigneCommande);
router.patch('/annuler/:id_commande', verifyToken, annulerCommandeController);

export default router;
