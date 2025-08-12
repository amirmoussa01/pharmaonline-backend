import express from 'express';
import {
  listCategories,
  getCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  searchCategoryController,
} from '../controllers/categoryController.js';

import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Public
router.get('/', listCategories);
router.get('/search', searchCategoryController);
router.get('/:id', getCategory);

// Protégées (exemple: seulement admin)
router.post('/', verifyToken,verifyAdmin, createCategoryController);
router.put('/:id', verifyToken,verifyAdmin, updateCategoryController);
router.delete('/:id', verifyToken,verifyAdmin, deleteCategoryController);

export default router;
