import db from '../config/db.js';

export async function getOrdonnancesByUser(id_utilisateur) {
  const [rows] = await db.query("SELECT * FROM ordonnances WHERE id_utilisateur = ?", [id_utilisateur]);
  return rows;
}

export async function getOrdonnancesByCommande(id_commande) {
  const [rows] = await db.query("SELECT * FROM ordonnances WHERE id_commande = ?", [id_commande]);
  return rows;
}

export async function getOrdonnanceById(id) {
  const [rows] = await db.query("SELECT * FROM ordonnances WHERE id = ?", [id]);
  return rows[0];
}

export async function createOrdonnance({ id_utilisateur, id_commande, fichier, date_expiration }) {
  const [res] = await db.query(
    "INSERT INTO ordonnances (id_utilisateur, id_commande, fichier, date_expiration) VALUES (?, ?, ?, ?)",
    [id_utilisateur, id_commande, fichier, date_expiration]
  );
  return res.insertId;
}

export async function updateOrdonnance(id, { fichier, date_expiration }) {
  await db.query("UPDATE ordonnances SET fichier = ?, date_expiration = ? WHERE id = ?", [fichier, date_expiration, id]);
}

export async function deleteOrdonnance(id) {
  await db.query("DELETE FROM ordonnances WHERE id = ?", [id]);
}

export async function getAllOrdonnances({ search, sortBy, order }) {
  const searchClause = search
    ? `AND (u.nom LIKE ? OR u.email LIKE ? OR o.id_commande LIKE ?)`
    : "";
  const sortClause = `ORDER BY o.${sortBy} ${order.toUpperCase()}`;

  const [rows] = await db.query(`
    SELECT o.*, u.nom, u.prenom, u.email
    FROM ordonnances o
    JOIN utilisateurs u ON u.id = o.id_utilisateur
    WHERE 1=1 ${searchClause}
    ${sortClause}
  `, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []);

  return rows;
}
