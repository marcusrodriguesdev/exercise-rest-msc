const express = require('express');

const {
  createProduct, findProductById, findAllProducts,
} = require('../controllers/products.controllers');

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', findAllProducts);
router.get('/products/:id', findProductById);

module.exports = router;
