import express from 'express';
import {
  listOrdonnancesByUser,
  listOrdonnancesByCommande,
  getOrdonnance,
  createOrdonnanceController,
  updateOrdonnanceController,
  deleteOrdonnanceController,
  listAllOrdonnances
} from '../controllers/ordonnanceController.js';

import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middlewares/auth.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/ordonnances'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', verifyToken, listAllOrdonnances); // admin
router.get('/user', verifyToken, listOrdonnancesByUser);
router.get('/commande/:commandeId', verifyToken, listOrdonnancesByCommande);
router.get('/:id', verifyToken, getOrdonnance);
router.post('/', verifyToken, upload.single('fichier'), createOrdonnanceController);
router.put('/:id', verifyToken, upload.single('fichier'), updateOrdonnanceController);
router.delete('/:id', verifyToken, deleteOrdonnanceController);

export default router;
