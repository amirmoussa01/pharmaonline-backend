import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 1. Pour les photos d'utilisateurs ==========
const userDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(userDir)) {
  fs.mkdirSync(userDir, { recursive: true });
}

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Seules les images JPEG et PNG sont autorisées'), false);
};

export const upload = multer({ storage: userStorage, fileFilter });


// Pour les images de produits ==========
const productDir = path.join(__dirname, '../public/uploads/produits');

if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + ext);
  }
});

export const uploadProductImage = multer({ storage: productStorage, fileFilter });
