import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export async function getProfile(req, res) {
  try {
    const [rows] = await db.query('SELECT id, nom, prenom, email, role, photo FROM utilisateurs WHERE id = ?', [req.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

export const updateProfile = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, nouveau_mot_de_passe } = req.body;

  try {
    const userId = req.userId;

    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = rows[0];
    let hashedPassword = user.mot_de_passe; // valeur par défaut = mot de passe actuel
    let photo = user.photo; // valeur par défaut = photo actuelle

    // Gestion du mot de passe
    if (mot_de_passe && nouveau_mot_de_passe) {
      const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!match) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
      }
      hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);
    }

    // Gestion de la photo
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    await db.query(
      `UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, photo = ? WHERE id = ?`,
      [
        nom || user.nom,
        prenom || user.prenom,
        email || user.email,
        hashedPassword,
        photo,
        userId,
      ]
    );

    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const resultCount = await db.query(
      'SELECT COUNT(*) AS count FROM commandes WHERE id_utilisateur = ?',
      [userId]
    );
    const commandesCount = resultCount[0][0].count;
    const resultRevenue = await db.query(
      'SELECT COALESCE(SUM(montant_total), 0) AS revenue FROM commandes WHERE id_utilisateur = ? AND statut = ?',
      [userId, 'payée']
    );
    const revenue = resultRevenue[0][0].revenue;
    const [recentCommandes] = await 

db.query(
      'SELECT id, date_commande, montant_total, statut FROM commandes WHERE id_utilisateur = ? ORDER BY date_commande DESC LIMIT 5',
      [userId]
    );
    const [userInfo] = await db.query(
      'SELECT nom, prenom, photo FROM utilisateurs WHERE id = ?',
      [userId]
    );
    res.json({
      commandesCount: parseInt(commandesCount),
      revenue: parseFloat(revenue),
      recentCommandes,
      userInfo: userInfo || { nom: 'Utilisateur', photo: null }
    });
  } catch (error) {

    console.error('Erreur getUserDashboardStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

