const Model = require('../models/products.models');
const Middlewares = require('../middlewares/validation');

const createProduct = async (name, quantity) => {
  const validName = Middlewares.validationName(name);
  const validQuantity = Middlewares.validationQuantity(quantity);
  if (!validName.isValid) return validName;
  if (!validQuantity.isValid) return validQuantity;

  const alreadyExists = await Model.findByName(name);
  if (alreadyExists) {
    return { err: { code: 'invalid_data', message: 'Product already exists' } };
  }

  const { insertedId } = await Model.createProduct(name, quantity);
  return { _id: insertedId, name, quantity };
};

const findAllProducts = async () => {
  const products = await Model.findAllProducts();

  return products;
};

const findProductById = async (id) => {
  const product = await Model.findProductById(id);

  if (!product) return { err: { code: 'invalid_data', message: 'Wrong id format' } };

  return product;
};

const updateProduct = async (id, name, quantity) => {
  const validName = Middlewares.validationName(name);
  const validQuantity = Middlewares.validationQuantity(quantity);
  if (!validName.isValid) return validName;
  if (!validQuantity.isValid) return validQuantity;

  const alreadyExists = await Model.findProductById(id);
  if (!alreadyExists) return { err: { code: 'invalid_data', message: 'Wrong id format' } };

  await Model.updateProduct(id, name, quantity);

  return { _id: id, name, quantity };
};

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
  updateProduct,
};
