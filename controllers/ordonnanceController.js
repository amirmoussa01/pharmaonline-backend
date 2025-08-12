import {
  getOrdonnancesByUser,
  getOrdonnancesByCommande,
  getOrdonnanceById,
  createOrdonnance,
  updateOrdonnance,
  deleteOrdonnance,
  getAllOrdonnances
} from '../models/ordonnanceModel.js';

export async function listOrdonnancesByUser(req, res) {
  try {
    const id_utilisateur = req.userId;
    const ordonnances = await getOrdonnancesByUser(id_utilisateur);
    res.json(ordonnances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function listOrdonnancesByCommande(req, res) {
  try {
    const id_commande = req.params.commandeId;
    const ordonnances = await getOrdonnancesByCommande(id_commande);
    res.json(ordonnances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getOrdonnance(req, res) {
  try {
    const id = req.params.id;
    const ordonnance = await getOrdonnanceById(id);
    if (!ordonnance) return res.status(404).json({ message: 'Ordonnance non trouvée.' });
    res.json(ordonnance);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function createOrdonnanceController(req, res) {
  try {
    const id_utilisateur = req.userId;
    const { id_commande, date_expiration } = req.body;
    const fichier = req.file ? `/uploads/ordonnances/${req.file.filename}` : null;

    if (!id_commande || !fichier) {
      return res.status(400).json({ message: "Champs 'id_commande' et 'fichier' requis." });
    }

    const id = await createOrdonnance({ id_utilisateur, id_commande, fichier, date_expiration });
    res.status(201).json({ message: 'Ordonnance créée', id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'ordonnance.' });
  }
}

export async function updateOrdonnanceController(req, res) {
  try {
    const id = req.params.id;
    const { date_expiration } = req.body;
    const ordonnance = await getOrdonnanceById(id);
    if (!ordonnance) return res.status(404).json({ message: 'Ordonnance non trouvée.' });

    const fichier = req.file ? `/uploads/ordonnances/${req.file.filename}` : ordonnance.fichier;
    await updateOrdonnance(id, { fichier, date_expiration });

    res.json({ message: 'Ordonnance mise à jour.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
}

export async function deleteOrdonnanceController(req, res) {
  try {
    const id = req.params.id;
    const ordonnance = await getOrdonnanceById(id);
    if (!ordonnance) return res.status(404).json({ message: 'Ordonnance non trouvée.' });

    await deleteOrdonnance(id);
    res.json({ message: 'Ordonnance supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
}

export async function listAllOrdonnances(req, res) {
  try {
    const { search = "", sortBy = "date_creation", order = "desc" } = req.query;
    const ordonnances = await getAllOrdonnances({ search, sortBy, order });
    res.json(ordonnances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}
