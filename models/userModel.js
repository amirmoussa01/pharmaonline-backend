import db from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
  return rows[0];
}

export async function createUser({ nom, prenom, email, mot_de_passe, role = 'client', photo }) {
  const [result] = await db.query(
    `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, photo) VALUES (?, ?, ?, ?, ?)`,
    [nom, prenom, email, mot_de_passe, photo]
  );
  return result.insertId;
}
export const getAllUsers = async () => {
  const [rows] = await db.query('SELECT id, nom, prenom, email, role, actif, photo FROM utilisateurs');
  return rows;
};

export const updateUserRole = async (id, role) => {
  const [res] = await db.query('UPDATE utilisateurs SET role = ? WHERE id = ?', [role, id]);
  return res.affectedRows;
};

export const updateUserStatus = async (id, actif) => {
  const [res] = await db.query('UPDATE utilisateurs SET actif = ? WHERE id = ?', [actif, id]);
  return res.affectedRows;
};

export const deleteUser = async (id) => {
  const [res] = await db.query('DELETE FROM utilisateurs WHERE id = ?', [id]);
  return res.affectedRows;
};

export async function getUserById(id) {
  const [rows] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [id]);
  return rows[0];
};

export const getFilteredUsers = async ({ search, actif, role, sortBy = 'id', order = 'asc' }) => {
  let query = 'SELECT id, nom, prenom, email, role, actif, photo FROM utilisateurs WHERE 1';
  const params = [];

  if (search) {
    query += ' AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)';
    const keyword = `%${search}%`;
    params.push(keyword, keyword, keyword);
  }

  if (actif !== undefined && actif !== '') {
    query += ' AND actif = ?';
    params.push(actif);
  }

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  const allowedSort = ['id', 'nom', 'email', 'role', 'actif'];
  if (!allowedSort.includes(sortBy)) sortBy = 'id';
  const direction = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  query += ` ORDER BY ${sortBy} ${direction}`;

  const [rows] = await db.query(query, params);
  return rows;
};
