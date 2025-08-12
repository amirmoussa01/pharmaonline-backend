import express from 'express';
import { register, login, } from '../controllers/authController.js';
import { upload } from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/auth.js';
import { getProfile, updateProfile } from '../controllers/userController.js';


const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.single('photo'), updateProfile);
export default router;
