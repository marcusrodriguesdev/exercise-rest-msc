const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/products', productsRouter);

module.exports = app;
