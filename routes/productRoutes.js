import express from 'express';
import {
  listProducts,
  getProduct,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/productController.js';

import { uploadProductImage } from '../middlewares/upload.js';
import { verifyToken,verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', verifyToken,verifyAdmin, uploadProductImage.single('image'), createProductController);
router.put('/:id', verifyToken,verifyAdmin, uploadProductImage.single('image'), updateProductController);
router.delete('/:id', verifyToken,verifyAdmin, deleteProductController);

export default router;
