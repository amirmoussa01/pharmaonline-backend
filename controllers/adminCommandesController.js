import { getAllCommandesAdmin, updateCommandeStatutEtMessage } from '../models/commandeModel.js';

export async function listerToutesLesCommandes(req, res) {
  try {
    const commandes = await getAllCommandesAdmin();
    res.json(commandes);
  } catch (error) {
    console.error("Erreur admin commandes:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

export async function changerStatutCommande(req, res) {
  const { id_commande } = req.params;
  const { statut, message_admin } = req.body;

  try {
    await updateCommandeStatutEtMessage(id_commande, statut, message_admin);
    res.json({ message: `Commande ${statut} avec succès.` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du changement de statut.' });
  }
}
