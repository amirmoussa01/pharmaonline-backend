import { countUsers, countCommandes, sumRevenue } from '../models/adminModel.js';
import { getCommandesByDay } from '../models/adminModel.js';

export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await countUsers();
    const commandesCount = await countCommandes();
    const revenue = await sumRevenue();

    res.json({ usersCount, commandesCount, revenue });
  } catch (error) {
    console.error('Erreur getAdminStats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getCommandesByDayController = async (req, res) => {
  try {
    const data = await getCommandesByDay();
    res.json(data);
  } catch (error) {
    console.error('Erreur getCommandesByDay:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
