const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const router = express.Router();

router
  .get('/category/:categoryId', async (req, res) => {
    const category = await Client.findOne(req.params.categoryId, 'category');
    res.send(category);
  })

  .get('/product/:productId', async (req, res) => {
    const product = await Client.findOne(req.params.productId, 'product');
    res.send(product);
  })

  .get('/products/:categoryId', async (req, res) => {
    fetch(
      `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${req.params.categoryId}&sort=RELEVANCE&size=24&subcategories-style=tree-navigation&c=plp`
    )
      .then(response => response.json())
      .then(json => res.send(json.productListPage));
  });

module.exports = router;
