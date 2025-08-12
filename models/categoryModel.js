import db from '../config/db.js';

export async function getAllCategories() {
  const [rows] = await db.query('SELECT * FROM categories');
  return rows;
}

export async function getCategoryById(id) {
  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
}

export async function createCategory({ nom, description }) {
  const [result] = await db.query(
    'INSERT INTO categories (nom, description) VALUES (?, ?)',
    [nom, description]
  );
  return result.insertId;
}

export async function updateCategory(id, { nom, description }) {
  await db.query(
    'UPDATE categories SET nom = ?, description = ? WHERE id = ?',
    [nom, description, id]
  );
}


export async function isCategoryUsed(id) {
  const [rows] = await db.query(
    'SELECT id FROM produits WHERE categorie_id = ? LIMIT 1',
    [id]
  );
  return rows.length > 0;
}

export async function deleteCategory(id) {
  await db.query('DELETE FROM categories WHERE id = ?', [id]);
}


export async function searchCategories(keyword) {
  const [rows] = await db.query("SELECT * FROM categories WHERE nom LIKE ?", [`%${keyword}%`]);
  return rows;
}
