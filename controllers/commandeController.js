import {
  createCommande,
  findCommandeEnAttente,
  addOrUpdateLigneCommande,
  updateMontantTotal,
  getCommandesByUser,
  getCommandeWithLignes,
  updateLigneCommande,
  deleteLigneCommande,
  annulerCommande,
} from '../models/commandeModel.js';
import { getProductById } from '../models/productModel.js';

export async function commanderProduit(req, res) {
  try {
    const id_utilisateur = req.userId;
    const { id_produit, quantite } = req.body;

    const produit = await getProductById(id_produit);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable' });

    let commande = await findCommandeEnAttente(id_utilisateur);
    if (!commande) {
      const id = await createCommande(id_utilisateur);
      commande = { id };
    }

    await addOrUpdateLigneCommande(commande.id, id_produit, quantite, produit.prix);
    await updateMontantTotal(commande.id);

    res.status(201).json({ message: 'Produit ajouté à la commande' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la commande.' });
  }
}

export async function listerCommandesUtilisateur(req, res) {
  const commandes = await getCommandesByUser(req.userId);
  res.json(commandes);
}

export async function detailsCommande(req, res) {
  const { id } = req.params;
  const commande = await getCommandeWithLignes(id);
  if (!commande) return res.status(404).json({ message: 'Commande introuvable' });
  res.json(commande);
}

export async function modifierLigneCommande(req, res) {
  const { id_ligne } = req.params;
  const { quantite } = req.body;
  await updateLigneCommande(id_ligne, quantite);
  res.json({ message: 'Ligne modifiée' });
}

export async function supprimerLigneCommande(req, res) {
  const { id_ligne } = req.params;
  await deleteLigneCommande(id_ligne);
  res.json({ message: 'Ligne supprimée' });
}

export async function annulerCommandeController(req, res) {
  const { id_commande } = req.params;
  await annulerCommande(id_commande);
  res.json({ message: 'Commande annulée (statut mis à jour)' });
}
