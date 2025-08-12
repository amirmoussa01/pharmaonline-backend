import db from '../config/db.js';

export async function getAllProducts() {
  const [rows] = await db.query(`
    SELECT p.*, c.nom AS categorie
    FROM produits p
    LEFT JOIN categories c ON p.categorie_id = c.id
  `);
  return rows;
}

export async function getProductById(id) {
  const [rows] = await db.query('SELECT * FROM produits WHERE id = ?', [id]);
  return rows[0];
}

export async function createProduct({ nom, description, prix, quantite, categorie_id, image }) {
  const [result] = await db.query(`
    INSERT INTO produits (nom, description, prix, quantite, categorie_id, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [nom, description, prix, quantite, categorie_id, image]);
  return result.insertId;
}

export async function updateProduct(id, data) {
  const { nom, description, prix, quantite, categorie_id, image } = data;
  await db.query(`
    UPDATE produits
    SET nom = ?, description = ?, prix = ?, quantite = ?, categorie_id = ?, image = ?
    WHERE id = ?
  `, [nom, description, prix, quantite, categorie_id, image, id]);
}

export async function deleteProduct(id) {
  await db.query('DELETE FROM produits WHERE id = ?', [id]);
}

export async function searchProducts({ q, categorie_id, sort }) {
  let baseQuery = `
    SELECT p.*, c.nom AS categorie
    FROM produits p
    LEFT JOIN categories c ON p.categorie_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    baseQuery += ' AND p.nom LIKE ?';
    params.push(`%${q}%`);
  }

  if (categorie_id) {
    baseQuery += ' AND p.categorie_id = ?';
    params.push(categorie_id);
  }

  if (sort === 'asc') {
    baseQuery += ' ORDER BY p.prix ASC';
  } else if (sort === 'desc') {
    baseQuery += ' ORDER BY p.prix DESC';
  }

  const [rows] = await db.query(baseQuery, params);
  return rows;
}
