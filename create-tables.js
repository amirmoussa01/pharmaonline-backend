import db from './config/db.js';

try {
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100),
      description TEXT
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS produits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100),
      description TEXT,
      prix DECIMAL(10,2),
      quantite INT,
      categorie_id INT,
      FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user'
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'expediée', 'validée','annulée,payée') DEFAULT 'en_attente',
    montant_total DECIMAL(10,2),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS lignes_commande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT,
    id_produit INT,
    quantite INT,
    prix_unitaire DECIMAL(10,2),
    FOREIGN KEY (id_commande) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produits(id) ON DELETE SET NULL
    );
  `);
  await db.query(`
   CREATE TABLE IF NOT EXISTS paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT,
    adresse VARCHAR(255),
    description TEXT,
    telephone VARCHAR(20),
    type_paiement ENUM('en_ligne', 'a_la_livraison'),
    statut ENUM('en_attente', 'reussi', 'echoue') DEFAULT 'en_attente',
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_commande) REFERENCES commandes(id) ON DELETE CASCADE
  );
  `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS ordonnances (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_utilisateur INT,
        fichier VARCHAR(255),
        date_expiration DATE,
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
    `);
    await db.query(`
      ALTER TABLE ordonnances
      ADD COLUMN id_commande INT AFTER id_utilisateur,
      ADD CONSTRAINT fk_ordonnance_commande
      FOREIGN KEY (id_commande) REFERENCES commandes(id) ON DELETE CASCADE;
    `);
     await db.query(`
    ALTER TABLE produits ADD COLUMN image VARCHAR(255) AFTER categorie_id;
    `);
    await db.query(`
    ALTER TABLE utilisateurs ADD COLUMN photo VARCHAR(255) DEFAULT NULL;
    `);
   


  console.log("Tables créées avec succès.");
  process.exit();
} catch (error) {
  console.error("Erreur lors de la création des tables :", error.message);
  process.exit(1);
}
