const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const router = express.Router();

const getSuggestionProductsId = productId => new Promise((resolve, reject) => {
  fetch(`https://ikeasources.ru/api/v1/product/${productId}/suggestion`)
    .then(response => response.json())
    .then(json => resolve(json))
    .catch(e => reject(e));
});

router
  .get('/:productId', async (req, res) => {
    const { productId } = req.params;
    const data = await getSuggestionProductsId(productId);
    console.log('Data', data);

    res.send('Ok');
  });

module.exports = router;
