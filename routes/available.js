const express = require('express');
const getAvailableProduct = require('../libs/getAvailableProduct');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type } = req.query;
  const id = req.query.id.replace('s', '');
  const result = await getAvailableProduct({ type, id });

  return res.send(result);
});

module.exports = router;
