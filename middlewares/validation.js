const validationName = (name) => {
  if (name.length < 5 || !name || typeof name !== 'string') {
    return {
      isValid: false,
      err: {
        code: 'invalid_data',
        message: '"name", length must be at least 5 characters long',
      },
    };
  }
  return { isValid: true };
};

const validationQuantity = (quantity) => {
  if (quantity <= 0) {
    return {
      isValid: false,
      err: {
        code: 'invalid_data',
        message: '"quantity", must be larger than or equal to 1',
      },
    };
  }

  if (!quantity || typeof quantity !== 'number') {
    return {
      isValid: false,
      err: {
        code: 'invalid_data',
        message: '"quantity", must be a number',
      },
    };
  }

  return { isValid: true };
};

module.exports = {
  validationName,
  validationQuantity,
};
