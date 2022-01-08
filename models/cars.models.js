const connection = require('./connection');

const create = async (marca, modelo, ano, cor, placa) => {
  const connect = await connection();
  const { insertId } = connect.collection('carros').insertOne({
    marca, modelo, ano, cor, placa,
  });

  return insertId;
};

const getAllCars = async () => {
  const connect = await connection();
  const query = connect.collection('carros').find({}).toArray();

  return query;
};

const getCarByName = async (name) => {
  const connect = await connection();
  const query = connect.collection('carros').findOne({ name });

  return query;
};

const updateCar = async (placa) => {
  const connect = await connection();
  const query = connect.collection('carros').updateOne({ placa });

  return query;
};

const deleteCar = async (placa) => {
  const connect = await connection();
  const query = connect.collection('carros').deleteOne({ placa });

  return query;
};

module.exports = {
  create,
  getCarByName,
  updateCar,
  getAllCars,
  deleteCar,
};
