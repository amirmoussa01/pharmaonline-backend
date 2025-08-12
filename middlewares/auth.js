import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = await getUserById(decoded.id); 

    if (!req.user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    if (req.user.actif === false) return res.status(403).json({ message: 'Compte désactivé.' });

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

export function verifyAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  next();
}
