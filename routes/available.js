const express = require('express');

const getAvailable = require('./../libs/getAvailable');
const getAvailableProduct = require('../libs/getAvailableProduct');
const updateProducts = require('../libs/updateProducts');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type, id } = req.query;
  const result = await getAvailable({ type, id });

  return res.send(result);
})
  .put('/:type/:productId', async (req, res) => {
    const { type } = req.params;
    const { productId } = req.params;
    const result = await getAvailableProduct({ type, id: productId });

    await updateProducts([result]);

    res.send('Ok');
  });

module.exports = router;
