const express = require('express');

const getAvailable = require('./../libs/getAvailable');
const updateProducts = require('../libs/updateProducts');

const router = express.Router();

router.get('/', async (req, res) => {
  const { type, id } = req.query;
  const result = await getAvailable({ type, id });

  return res.send(result);
})
  .put('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const result = await getAvailable({ type, id });

    await updateProducts([result]);

    res.send('Ok');
  });

module.exports = router;
