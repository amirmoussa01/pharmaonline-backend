import db from '../config/db.js';

export async function createCommande(id_utilisateur) {
  const [res] = await db.execute(
    "INSERT INTO commandes (id_utilisateur, statut, date_commande) VALUES (?, 'en_attente', NOW())",
    [id_utilisateur]
  );
  return res.insertId;
}

export async function findCommandeEnAttente(id_utilisateur) {
  const [rows] = await db.execute(
    "SELECT * FROM commandes WHERE id_utilisateur = ? AND statut = 'en_attente'",
    [id_utilisateur]
  );
  return rows[0];
}

export async function addOrUpdateLigneCommande(id_commande, id_produit, quantite, prix) {
  const [rows] = await db.execute(
    "SELECT * FROM lignes_commande WHERE id_commande = ? AND id_produit = ?",
    [id_commande, id_produit]
  );

  if (rows.length > 0) {
    await db.execute(
      "UPDATE lignes_commande SET quantite = quantite + ? WHERE id_commande = ? AND id_produit = ?",
      [quantite, id_commande, id_produit]
    );
  } else {
    await db.execute(
      "INSERT INTO lignes_commande (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)",
      [id_commande, id_produit, quantite, prix]
    );
  }
}

export async function updateMontantTotal(id_commande) {
  const [rows] = await db.execute(
    "SELECT SUM(quantite * prix_unitaire) AS total FROM lignes_commande WHERE id_commande = ?",
    [id_commande]
  );
  const total = rows[0]?.total || 0;

  await db.execute("UPDATE commandes SET montant_total = ? WHERE id = ?", [total, id_commande]);
}

export async function getCommandesByUser(id_utilisateur) {
  const [rows] = await db.execute(
    "SELECT * FROM commandes WHERE id_utilisateur = ? ORDER BY date_commande DESC",
    [id_utilisateur]
  );
  return rows;
}

export async function getCommandeWithLignes(id_commande) {
  const [commandeRows] = await db.execute(
    "SELECT * FROM commandes WHERE id = ?",
    [id_commande]
  );
  const commande = commandeRows[0];

  if (!commande) return null;

  const [lignes] = await db.execute(
    `SELECT lc.*, p.nom FROM lignes_commande lc
     JOIN produits p ON p.id = lc.id_produit
     WHERE lc.id_commande = ?`,
    [id_commande]
  );

  return { ...commande, lignes };
}

export async function updateLigneCommande(id_ligne, quantite) {
  await db.execute("UPDATE lignes_commande SET quantite = ? WHERE id = ?", [quantite, id_ligne]);
}

export async function deleteLigneCommande(id_ligne) {
  await db.execute("DELETE FROM lignes_commande WHERE id = ?", [id_ligne]);
}

export async function annulerCommande(id_commande) {
  await db.execute("UPDATE commandes SET statut = 'annulee' WHERE id = ?", [id_commande]);
}

export async function getAllCommandesAdmin() {
  const [rows] = await db.query(`
    SELECT c.id, c.montant_total, c.statut, c.date_commande, c.message_admin,
           u.nom, u.prenom, u.email
    FROM commandes c
    JOIN utilisateurs u ON c.id_utilisateur = u.id
    ORDER BY c.date_commande DESC
  `);
  return rows;
}

export async function updateCommandeStatutEtMessage(id_commande, statut, message_admin = null) {
  await db.query(
    `UPDATE commandes SET statut = ?, message_admin = ? WHERE id = ?`,
    [statut, message_admin, id_commande]
  );
}

export async function updateCommandeStatut(id_commande, statut) {
  await db.query(`UPDATE commandes SET statut = ? WHERE id = ?`, [statut, id_commande]);
}

