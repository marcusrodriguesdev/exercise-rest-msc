const express = require('express');

const { createProduct } = require('../controllers/products.controllers');

const router = express.Router();

router.post('/products', createProduct);

module.exports = router;
