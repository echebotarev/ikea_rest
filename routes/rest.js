const express = require('express');

const router = express.Router();

router
  .get('/cat/:categoryId', async (req, res) => res.end(`Category: ${req.params.categoryId}`))

  .get('/p/:productId', async (req, res) => res.end(`Product: ${req.params.productId}`));

module.exports = router;
