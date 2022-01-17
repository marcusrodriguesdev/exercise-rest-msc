// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProduct = async (id, name, quantity) => {
  const db = await connection();
  const { insertedId } = await db
    .collection('products').insertOne({ name, quantity });

  return { _id: insertedId, name, quantity };
};

const findByName = async (name) => {
  const db = await connection();
  const query = db.collection('products').findOne({ name });

  return query;
};

module.exports = {
  createProduct,
  findByName,
};
