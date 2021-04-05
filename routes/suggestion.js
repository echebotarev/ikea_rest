const express = require('express');
const fetch = require('node-fetch');
const getProductsFromDB = require('./../utils/getProductsFromDB');
const { samaraShopId } = require('./../constant');

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
    const { ikeaShopId = samaraShopId } = req.cookies;
    const { data } = await getSuggestionProductsId(productId);
    const products = await getProductsFromDB(data, 'id', ikeaShopId);

    res.send(products);
  });

module.exports = router;
