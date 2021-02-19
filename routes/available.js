const express = require('express');
const getAvailableProduct = require('../libs/getAvailableProduct');
const updateProducts = require('../libs/updateProducts');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type } = req.query;
  const id = req.query.id.replace('s', '');
  const result = await getAvailableProduct({ type, id });

  return res.send(result);
})
  .put('/:type/:productId', async (req, res) => {
    const { type } = req.params;
    const { productId } = req.params;
    const result = await getAvailableProduct({ type, id: productId });

    updateProducts([result]);

    res.send('Ok');
  });

module.exports = router;
