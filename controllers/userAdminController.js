// controllers/userAdminController.js
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getFilteredUsers
} from '../models/userModel.js';

export const listUsers = async (req, res) => {
  try {
    const { search = '', actif, role, sortBy, order } = req.query;

    const allowedSortFields = ['id', 'nom', 'email', 'role', 'actif'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const finalOrder = (order === 'desc' || order === 'asc') ? order : 'asc';

    const users = await getFilteredUsers({
      search,
      actif: actif !== undefined ? actif : undefined,
      role,
      sortBy: finalSortBy,
      order: finalOrder
    });

    res.json(users);
  } catch (err) {
    console.error('Erreur listUsers:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  try {
    const updated = await updateUserRole(id, role);
    if (updated) {
      res.json({ message: 'Rôle mis à jour' });
    } else {
      res.status(404).json({ message: 'Utilisateur introuvable' });
    }
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const toggleActivation = async (req, res) => {
  const { id } = req.params;
  const { actif } = req.body;

  try {
    const updated = await updateUserStatus(id, actif);
    if (updated) {
      res.json({ message: actif ? 'Utilisateur activé' : 'Utilisateur désactivé' });
    } else {
      res.status(404).json({ message: 'Utilisateur introuvable' });
    }
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const removeUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteUser(id);
    if (deleted) {
      res.json({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ message: 'Utilisateur introuvable' });
    }
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
