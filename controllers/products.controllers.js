const Service = require('../services/products.services');

const createProduct = async (_req, res) => {
  const { name, quantity } = _req.body;
  const product = await Service.createProduct(name, quantity);

  if (product.err) return res.status(422).json({ err: product.err });

  return res.status(201).json(product);
};

module.exports = {
  createProduct,
};
