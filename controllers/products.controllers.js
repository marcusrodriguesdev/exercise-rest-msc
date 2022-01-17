const Service = require('../services/products.services');

const createProduct = async (_req, res) => {
  const { name, quantity } = _req.body;
  const product = await Service.createProduct(name, quantity);

  if (product.err) return res.status(422).json({ err: product.err });

  return res.status(201).json(product);
};

const findAllProducts = async (_req, res) => {
  const products = await Service.findAllProducts();

  return res.status(200).json({ products });
};

const findProductById = async (_req, res) => {
  const { id } = _req.params;
  const product = await Service.findProductById(id);

  if (product.err) return res.status(422).json({ err: product.err });

  return res.status(200).json(product);
};

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
};
