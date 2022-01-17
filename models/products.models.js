const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProduct = async (name, quantity) => {
  const db = await connection();
  const query = await db.collection('products').insertOne({ name, quantity });

  return query;
};

const findByName = async (name) => {
  const db = await connection();
  const query = await db.collection('products').findOne({ name });

  return query;
};

const findAllProducts = async () => {
  const db = await connection();
  const query = await db.collection('products').find({}).toArray();

  return query;
};

const findProductById = async (id) => {
  const db = await connection();
  if (!ObjectId.isValid(id)) return null;
  const query = await db.collection('products').findOne({ _id: ObjectId(id) });

  return query;
};

const updateProduct = async (id, name, quantity) => {
  const db = await connection();
  if (!ObjectId.isValid(id)) return null;

  const query = await db
    .collection('products').updateOne({ _id: ObjectId(id) }, { $set: { name, quantity } });

  return query;
};

module.exports = {
  createProduct,
  findByName,
  findAllProducts,
  findProductById,
  updateProduct,
};
