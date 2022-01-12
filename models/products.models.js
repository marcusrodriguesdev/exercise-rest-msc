// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProducts = async (id, name, quantity) => {
  const db = await connection();
  const { insertedId } = await db
    .collection('products').insertOne({ name, quantity });

  return { _id: insertedId, name, quantity };
};

module.exports = {
  createProducts,
};
