import {
  createPaiement,
  getAllPaiements,
  getPaiementsByUser,
  getPaiementById,
} from '../models/paiementModel.js';
import { updateCommandeStatut } from '../models/commandeModel.js';

export async function creerPaiement(req, res) {
  try {
    const { id_commande, adresse, description, telephone, type_paiement } = req.body;

    if (!id_commande || !adresse || !telephone || !type_paiement) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const statut = 'en_attente'; // ou "en_attente" si tu veux gérer un statut plus souple
    const id = await createPaiement({
      id_commande,
      adresse,
      description,
      telephone,
      type_paiement,
      statut,
    });

    await updateCommandeStatut(id_commande, 'payée');

    res.status(201).json({ message: 'Paiement enregistré avec succès.', id });
  } catch (error) {
    console.error('Erreur lors du paiement :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getMesPaiements(req, res) {
  try {
    const paiements = await getPaiementsByUser(req.userId);
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getTousPaiements(req, res) {
  try {
    const paiements = await getAllPaiements();
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

export async function getPaiement(req, res) {
  try {
    const paiement = await getPaiementById(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement introuvable.' });
    }
    res.json(paiement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}
