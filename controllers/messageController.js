import {
  envoyerMessage,
  getMessagesBetweenUsers,
  marquerCommeLu,
  getMessagesNonLus,
  getAdmins,
  getAllNonAdminUsers
} from '../models/messageModel.js';

let io = null;
export const setIo = (ioInstance) => {
  io = ioInstance;
};

export const sendMessage = async (req, res) => {
  const expediteur_id = req.userId;
  const { destinataire_id, contenu } = req.body;

  if (!destinataire_id || !contenu) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const id = await envoyerMessage({ expediteur_id, destinataire_id, contenu });
    const messages = await getMessagesBetweenUsers(expediteur_id, destinataire_id);
    const message = messages.find(m => m.id === id);

    if (io && message) {
      io.to(`user_${destinataire_id}`).emit('new_message', message);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error('Erreur envoi message:', err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getConversation = async (req, res) => {
  const userId1 = req.userId;
  const { withUser } = req.params;

  try {
    const messages = await getMessagesBetweenUsers(userId1, withUser);
    res.json(messages);
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    await marquerCommeLu(id);
    res.json({ message: "Message marqué comme lu" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getUnreadMessages = async (req, res) => {
  const userId = req.userId;

  try {
    const messages = await getMessagesNonLus(userId);
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getAdminsForMessaging = async (req, res) => {
  try {
    const admins = await getAdmins();
    res.json(admins);
  } catch (err) {
    console.error('Erreur getAdminsForMessaging:', err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getUsersForAdmin = async (req, res) => {
  try {
    const search = req.query.search || '';
    const users = await getAllNonAdminUsers(search);
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur chargement utilisateurs" });
  }
};
