const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products.router');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(productsRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
