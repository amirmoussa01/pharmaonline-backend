// routes/adminUsersRoutes.js
import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import {
  listUsers,
  changeRole,
  toggleActivation,
  removeUser
} from '../controllers/userAdminController.js';

const router = express.Router();

router.get('/', verifyToken , listUsers);
router.patch('/:id/role', verifyToken, verifyAdmin, changeRole);
router.patch('/:id/activation', verifyToken, verifyAdmin, toggleActivation);
router.delete('/:id', verifyToken, verifyAdmin, removeUser);

export default router;
