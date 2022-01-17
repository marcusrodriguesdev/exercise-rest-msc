const Model = require('../models/products.models');
const Middlewares = require('../middlewares/validation');

const createProduct = async (name, quantity) => {
  const validName = Middlewares.validationName(name);
  const validQuantity = Middlewares.validationQuantity(quantity);
  if (!validName.isValid) return validName;
  if (!validQuantity.isValid) return validQuantity;

  const alreadyExists = await Model.findByName(name);
  if (alreadyExists) {
    return {
      isValid: false,
      err: {
        code: 'invalid_data',
        message: 'Product aleready exists',
      },
    };
  }

  const product = await Model.createProduct(name, quantity);
  return { id: product.id, ...product };
};

const findAllProducts = async () => {
  const products = await Model.findAllProducts();

  return products;
};

const findProductById = async (id) => {
  const product = await Model.findProductById(id);

  if (!product) {
    return {
      isValid: false,
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    };
  }

  return product;
};

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
};
