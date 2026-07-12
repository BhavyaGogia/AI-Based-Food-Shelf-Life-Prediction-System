const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// Apply requireAuth to all product routes
router.use(requireAuth);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
