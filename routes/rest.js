const express = require('express');
const Client = require('./../libs/mongoClient');

const router = express.Router();

router
  .get('/cat/:categoryId', async (req, res) => {
    const category = await Client.findOne(req.params.categoryId, 'category');
    res.send(category);
  })

  .get('/p/:productId', async (req, res) => {
    const product = await Client.findOne(req.params.productId, 'product');
    res.send(product);
  });

module.exports = router;
