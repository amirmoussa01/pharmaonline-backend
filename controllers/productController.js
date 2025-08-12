import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../models/productModel.js';

export async function listProducts(req, res) {
  try {
    const { q, categorie_id, sort } = req.query;

    if (q || categorie_id || sort) {
      const products = await searchProducts({ q, categorie_id, sort });
      return res.json(products);
    }

    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getProduct(req, res) {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function createProductController(req, res) {
  try {
    const { nom, description, prix, quantite, categorie_id } = req.body;
    const image = req.file ? `/uploads/produits/${req.file.filename}` : null;

    const id = await createProduct({
      nom,
      description,
      prix,
      quantite,
      categorie_id,
      image
    });

    res.status(201).json({ message: 'Produit créé', id });
  } catch (err) {
    console.error('Erreur produit :', err);
    res.status(500).json({ message: 'Erreur lors de la création du produit.' });
  }
}

export async function updateProductController(req, res) {
  try {
    const id = req.params.id;
    const { nom, description, prix, quantite, categorie_id } = req.body;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });

    const image = req.file ? `/uploads/produits/${req.file.filename}` : product.image;

    await updateProduct(id, {
      nom, description, prix, quantite, categorie_id, image
    });

    res.json({ message: 'Produit mis à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
}

export async function deleteProductController(req, res) {
  try {
    const id = req.params.id;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });

    await deleteProduct(id);
    res.json({ message: 'Produit supprimé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
}
