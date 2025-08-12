import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import commandeRoutes from './routes/commandeRoutes.js';
import ordonnanceRoutes from './routes/ordonnanceRoutes.js';
import adminCommandesRoutes from './routes/adminCommandesRoutes.js';
import adminUsersRoutes from './routes/adminUsersRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paiementRoutes from './routes/paiementRoutes.js';

import db from './config/db.js';
import * as messageController from './controllers/messageController.js'; // injection io

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

try {
  await db.connect();
  console.log('Connexion MySQL réussie');
} catch (error) {
  console.error('Erreur MySQL :', error.message);
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/produits', productRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/ordonnances', ordonnanceRoutes);
app.use('/api/adm', adminRoutes);
app.use('/api/admin', adminCommandesRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/paiements', paiementRoutes);

app.get('/', (req, res) => {
  res.send('API Pharmacie en ligne avec Socket.io !');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Map socket.id → { userId, role }
const connectedUsers = new Map();

// Map adminId (string) → socket.id
const onlineAdmins = new Map();

// Envoie la liste des utilisateurs (role='user') uniquement aux admins
const emitOnlineUsersToAdmins = () => {
  const userIds = Array.from(connectedUsers.values())
    .filter(u => u.role === 'user')
    .map(u => u.userId.toString());
  const uniqueUserIds = [...new Set(userIds)];

  onlineAdmins.forEach((socketId) => {
    io.to(socketId).emit('online_users', uniqueUserIds);
  });
};

// Envoie la liste des admins uniquement aux utilisateurs
const emitOnlineAdminsToUsers = () => {
  const adminsOnlineIds = Array.from(onlineAdmins.keys());

  connectedUsers.forEach(({ role }, socketId) => {
    if (role === 'user') {
      io.to(socketId).emit('updateOnlineAdmins', adminsOnlineIds);
    }
  });
};

io.on('connection', (socket) => {
  console.log('Client connecté via Socket.IO :', socket.id);

  socket.on('join', ({ userId, role }) => {
    if (!userId || !role) {
      console.warn('Join event invalide', { userId, role });
      return;
    }
    const userIdStr = userId.toString();
    socket.join(`user_${userIdStr}`);
    connectedUsers.set(socket.id, { userId: userIdStr, role });
    console.log(`👤 Utilisateur ${userIdStr} avec rôle ${role} a rejoint user_${userIdStr}`);

    if (role === 'admin') {
      onlineAdmins.set(userIdStr, socket.id);
    }

    // Met à jour les listes côté clients
    emitOnlineUsersToAdmins();
    emitOnlineAdminsToUsers();
  });

  socket.on('send_message', ({ toUserId, message }) => {
    io.to(`user_${toUserId.toString()}`).emit('new_message', message);
  });

  socket.on('disconnect', () => {
    const userInfo = connectedUsers.get(socket.id);
    if (userInfo) {
      const { userId, role } = userInfo;
      connectedUsers.delete(socket.id);
      console.log(`Déconnexion : ${socket.id} (user ${userId}, role ${role})`);

      if (role === 'admin') {
        onlineAdmins.delete(userId.toString());
      }

      // Mise à jour listes après déconnexion
      emitOnlineUsersToAdmins();
      emitOnlineAdminsToUsers();
    }
  });
});

messageController.setIo(io);

server.listen(PORT, () => {
  console.log(`Serveur Socket.IO en écoute sur http://localhost:${PORT}`);
});
