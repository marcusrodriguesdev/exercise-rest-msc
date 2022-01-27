const request = require('supertest');
const { MongoClient } = require('mongodb');
const server = require('../src/api/server');

const mongoDbUrl = `mongodb://${'localhost' || 'mongodb'}:27017/StoreManager`;

describe('1 - Crie um endpoint para o cadastro de produtos', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    const myobj = { name: 'Faca de cortar', quantity: 10 };
    await db.collection('products').insertOne(myobj);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível criar um produto com o nome menor que 5 caracteres', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Prod',
        quantity: 1,
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body.err.code).toBe('invalid_data');
    expect(res.body.err.message).toBe('"name" length must be at least 5 characters long');
  });

  it('Será validado que não é possível criar um produto com o mesmo nome de outro já existente', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Faca de cortar',
        quantity: 10,
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    });
  });

  it('Será validado que não é possível criar um produto com quantidade menor que zero', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Marcus',
        quantity: -1,
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body.err.code).toBe('invalid_data');
    expect(res.body.err.message).toBe('"quantity" must be larger than or equal to 1');
  });

  it('Será validado que não é possível criar um produto com uma string no campo quantidade', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Marcus',
        quantity: 'string',
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body.err.code).toBe('invalid_data');
    expect(res.body.err.message).toBe('"quantity" must be a number');
  });

  it('Será validado que é possível criar um produto com sucesso', async () => {
    const res = await request(server)
      .post('/products')
      .send({
        name: 'Produto',
        quantity: 5,
      });
    const { name, quantity } = res.body;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(name).toEqual('Produto');
    expect(quantity).toEqual(5);
  });
});
