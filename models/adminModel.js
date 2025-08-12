import db from '../config/db.js';

export const countUsers = async () => {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM utilisateurs WHERE role != ?', ['admin']);
  return rows[0]?.count ;
};

export const countCommandes = async () => {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM commandes');
  return rows[0]?.count ;
};

export const sumRevenue = async () => {
  const [rows] = await db.query('SELECT COALESCE(SUM(montant_total), 0) AS sum FROM commandes WHERE statut = ?', ['payée']);
  return rows[0]?.sum ;
};

export const getCommandesByDay = async () => {
  const [rows] = await db.query(`
    SELECT DATE(date_commande) AS date, COUNT(*) AS count
    FROM commandes
    WHERE date_commande >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(date_commande)
    ORDER BY DATE(date_commande) ASC
  `);
  return rows;
};
