import {getAllCategories,getCategoryById,createCategory,updateCategory,deleteCategory,searchCategories,isCategoryUsed} from '../models/categoryModel.js';

export async function listCategories(req, res) {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getCategory(req, res) {
  try {
    const id = req.params.id;
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function createCategoryController(req, res) {
  try {
    const { nom, description } = req.body;

    if (!nom) {
      return res.status(400).json({ message: 'Le nom est obligatoire.' });
    }

    const id = await createCategory({ nom, description });
    res.status(201).json({ message: 'Catégorie créée.', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function updateCategoryController(req, res) {
  try {
    const id = req.params.id;
    const { nom, description } = req.body;

    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }

    await updateCategory(id, { nom, description });
    res.json({ message: 'Catégorie mise à jour.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function deleteCategoryController(req, res) {
  try {
    const id = req.params.id;

    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' });
    }

    const used = await isCategoryUsed(id);
    if (used) {
      return res
        .status(400)
        .json({ message: 'Impossible de supprimer : cette catégorie est liée à un ou plusieurs produits.' });
    }

    await deleteCategory(id);
    res.json({ message: 'Catégorie supprimée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}


export async function searchCategoryController(req, res) {
  try {
    const { q } = req.query; 
    if (!q) return res.status(400).json({ message: "Requête de recherche vide." });

    const results = await searchCategories(q);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}