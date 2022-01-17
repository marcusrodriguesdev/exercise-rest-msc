const Model = require('../models/products.models');
const Middlewares = require('../middlewares/validation');

const createProduct = async (id, name, quantity) => {
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

  const product = await Model.createProduct(id, name, quantity);
  return product;
};

module.exports = {
  createProduct,
};
