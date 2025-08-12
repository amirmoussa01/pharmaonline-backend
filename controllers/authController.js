import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../models/userModel.js';
import { generateToken } from '../helpers/generateToken.js';

export async function register(req, res) {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;
    const file = req.file;

    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'La photo de profil est obligatoire.' });
    }

    const userExist = await findUserByEmail(email);
    if (userExist) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const photoPath = `/uploads/${file.filename}`;

    const userId = await createUser({ nom, prenom, email, mot_de_passe: hashedPassword, photo: photoPath });

    const token = generateToken(userId);

    res.status(201).json({
      message: 'Utilisateur inscrit avec succès',
      user: { id: userId, nom, prenom, email, photo: photoPath },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
}

export async function login(req, res) {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    if (!user.actif) {
      return res.status(403).json({ message: "Compte désactivé" });
    }

    const token = generateToken(user);

    res.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
}
