const express = require('express');

const {
  createProduct, findProductById, findAllProducts, updateProduct, deleteProduct,
} = require('../controllers/products.controllers');

const router = express.Router();

router.post('/', createProduct);
router.get('/', findAllProducts);
router.get('/:id', findProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
