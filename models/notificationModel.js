// backend/models/notificationModel.js
import db from '../config/db.js';

export const createNotification = async ({ utilisateur_id, titre, message, lien = null }) => {
  const [res] = await db.query(
    `INSERT INTO notifications (utilisateur_id, titre, message, lien) VALUES (?, ?, ?, ?)`,
    [utilisateur_id, titre, message, lien]
  );
  return res.insertId;
};

export const getNotificationsForUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

export const markNotificationAsRead = async (id) => {
  const [res] = await db.query(
    `UPDATE notifications SET lu = 1 WHERE id = ?`,
    [id]
  );
  return res.affectedRows;
};

export const markAllAsReadForUser = async (userId) => {
  const [res] = await db.query(
    `UPDATE notifications SET lu = 1 WHERE utilisateur_id = ?`,
    [userId]
  );
  return res.affectedRows;
};
