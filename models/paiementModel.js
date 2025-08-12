import db from '../config/db.js';

export async function createPaiement(paiement) {
  const { id_commande, adresse, description, telephone, type_paiement, statut } = paiement;
  const [result] = await db.query(
    `INSERT INTO paiements (id_commande, adresse, description, telephone, type_paiement, statut, date_paiement)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [id_commande, adresse, description, telephone, type_paiement, statut]
  );
  return result.insertId;
}

export async function getPaiementsByUser(userId) {
  const [rows] = await db.query(
    `SELECT p.*, c.date_commande, c.montant_total
     FROM paiements p
     JOIN commandes c ON p.id_commande = c.id
     WHERE c.id_utilisateur = ?`,
    [userId]
  );
  return rows;
}

export async function getAllPaiements() {
  const [rows] = await db.query(
    `SELECT p.*, u.nom AS utilisateur_nom, u.email
     FROM paiements p
     JOIN commandes c ON p.id_commande = c.id
     JOIN utilisateurs u ON c.id_utilisateur = u.id`
  );
  return rows;
}

export async function getPaiementById(id) {
  const [rows] = await db.query('SELECT * FROM paiements WHERE id = ?', [id]);
  return rows[0];
}
