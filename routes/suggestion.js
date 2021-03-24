const express = require('express');
const fetch = require('node-fetch');
const getProductsFromDB = require('./../utils/getProductsFromDB');

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
    const { data } = await getSuggestionProductsId(productId);
    const products = getProductsFromDB(data, 'id');

    res.send(products);
  });

module.exports = router;
