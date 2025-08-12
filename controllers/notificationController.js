// backend/controllers/notificationController.js
import {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  markAllAsReadForUser
} from '../models/notificationModel.js';

export const fetchNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    console.error("Erreur notifications:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const markOneAsRead = async (req, res) => {
  try {
    const updated = await markNotificationAsRead(req.params.id);
    if (updated) {
      res.json({ message: "Notification marquée comme lue" });
    } else {
      res.status(404).json({ message: "Notification non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await markAllAsReadForUser(req.user.id);
    res.json({ message: "Toutes les notifications marquées comme lues" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
