const request = require('supertest');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const server = require('../src/api/server');

const mongoDbUrl = `mongodb://${process.env.HOST || 'mongodb'}:27017/StoreManager`;

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

describe('2 - Crie um endpoint para listar os produtos', () => {
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
    await db.collection('sales').deleteMany({});
    const products = [{ name: 'Martelo de Thor', quantity: 10 },
      { name: 'Escudo do Capitão América', quantity: 30 }];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que todos produtos estão sendo retornados', async () => {
    const res = await request(server)
      .get('/products');
    const { body: { products } } = res;
    expect(products[0].name).toBe('Martelo de Thor');
    expect(products[0].quantity).toBe(10);
    expect(products[1].name).toBe('Escudo do Capitão América');
    expect(products[1].quantity).toBe(30);
  });

  it('Será validado que é possível listar um determinado produto', async () => {
    let result;

    await request(server)
      .post('/products')
      .send({
        name: 'Escudo do capitão america',
        quantity: 3,
      })
      .then((response) => {
        result = response.body;
      });

    const res = await request(server)
      .get(`/products/${result._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toBe(result._id);
    expect(res.body.name).toBe('Escudo do capitão america');
    expect(res.body.quantity).toBe(3);
  });

  it('Será validado que não é possível listar um produto que não existe', async () => {
    const res = await request(server)
      .get('/products/9999');

    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    });
  });
});

describe('3 - Crie um endpoint para atualizar um produto', () => {
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
    await db.collection('sales').deleteMany({});
    const products = [{ name: 'Martelo de Thor', quantity: 10 },
      { name: 'Escudo do Capitão América', quantity: 30 }];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível atualizar um produto com o nome menor que 5 caracteres', async () => {
    let resultId;

    await request(server)
      .get('/products')
      .then((response) => {
        const { body: { products } } = response;
        resultId = products[0]._id;
      });

    const res = await request(server)
      .put(`/products/${resultId}`)
      .send({
        name: 'Mar',
        quantity: 10,
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long',
      },
    });
  });

  it('Será validado que não é possível atualizar um produto com quantidade menor ou igual a zero', async () => {
    let resultId;

    await request(server)
      .get('/products')
      .then((response) => {
        const { body: { products } } = response;
        resultId = products[0]._id;
      });

    const res = await request(server)
      .put(`/products/${resultId}`)
      .send({
        name: 'Martelo',
        quantity: -2,
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1',
      },
    });
  });

  it('Será validado que não é possível atualizar um produto com uma string no campo quantidade', async () => {
    let resultId;

    await request(server)
      .get('/products')
      .then((response) => {
        const { body: { products } } = response;
        resultId = products[0]._id;
      });
    const res = await request(server)
      .put(`/products/${resultId}`)
      .send({
        name: 'Martelo',
        quantity: 'Valor',
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
    });
  });

  it('Será validado que é possível atualizar um produto com sucesso', async () => {
    let resultId;

    await request(server)
      .get('/products')
      .then((response) => {
        const { body: { products } } = response;
        resultId = products[0]._id;
      });
    const res = await request(server)
      .put(`/products/${resultId}`)
      .send({
        name: 'Produto Aleatorio',
        quantity: 10,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('quantity');
  });
});

describe('Crie um endpoint para deletar um produto', () => {
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
    await db.collection('sales').deleteMany({});
    const products = [{ name: 'Martelo de Thor', quantity: 10 },
      { name: 'Escudo do Capitão América', quantity: 30 }];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível deletar um produto que não existe', async () => {
    const res = await request(server)
      .delete('/products/999');
    expect(res.statusCode).toEqual(422);
    expect(res.body).toEqual({
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    });
  });

  it('Será validado que é possível deletar um produto com sucesso', async () => {
    let resultId;

    await request(server)
      .get('/products')
      .then((response) => {
        const { body: { products } } = response;
        resultId = products[0]._id;
      });

    const res = await request(server)
      .delete(`/products/${resultId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('acknowledged');
  });
});
