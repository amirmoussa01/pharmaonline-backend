import db from '../config/db.js';

export const envoyerMessage = async ({ expediteur_id, destinataire_id, contenu }) => {
  const [res] = await db.query(
    `INSERT INTO messages (expediteur_id, destinataire_id, contenu, created_at) VALUES (?, ?, ?,NOW())`,
    [expediteur_id, destinataire_id, contenu]
  );
  return res.insertId;
};

export const getMessagesBetweenUsers = async (userId1, userId2) => {
  const [rows] = await db.query(
    `SELECT * FROM messages 
     WHERE (expediteur_id = ? AND destinataire_id = ?) 
        OR (expediteur_id = ? AND destinataire_id = ?)
     ORDER BY created_at ASC`,
    [userId1, userId2, userId2, userId1]
  );
  return rows;
};

export const marquerCommeLu = async (messageId) => {
  const [res] = await db.query(
    `UPDATE messages SET lu = TRUE WHERE id = ?`,
    [messageId]
  );
  return res.affectedRows;
};

export const getMessagesNonLus = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM messages WHERE destinataire_id = ? AND lu = FALSE`,
    [userId]
  );
  return rows;
};

export const getAdmins = async () => {
  const [rows] = await db.query("SELECT id, nom, prenom, photo FROM utilisateurs WHERE role = 'admin'");
  return rows;
};

export const getAllNonAdminUsers = async (search) => {
  const sql = `
    SELECT id, nom, prenom, photo FROM utilisateurs 
    WHERE role != 'admin' 
    AND (nom LIKE ? OR prenom LIKE ?)
  `;
  const values = [`%${search}%`, `%${search}%`];

  const [rows] = await db.query(sql, values);
  return rows;
};