// const recIngka =
//   'https://rec.ingka.com/cached-services/ru-prod/items/80382359?filter=allSameCat&n=16&productId=80382359';
// const recApi = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/similar/product/${id}?categoryList=[${encodeURI(
//   categoryList
// )}]&details=true&size=16&currency=RUB&filter=[item_id][!=][${id}]&`;

const express = require('express');
const fetch = require('node-fetch');

const { samaraShopId } = require('./../constant');

const router = express.Router();

const getProductsFromDB = require('./../utils/getProductsFromDB');

const getRecommendedProductIds = ({ productId, filter = 'allSameCat' }) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://rec.ingka.com/services/ru-prod/items/${productId}?filter=${filter}&n=16&productId=${productId}`
    )
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(e => reject(e));
  });
const getRecommendedProductIdsByUrlScheme = ({ productId, type = 'style' }) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://rec.ingka.com/services/ru-prod/items/${type}/${
        type === 'style' ? productId : ''
      }?n=16&productId=${productId}`
    )
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(e => reject(e));
  });

router
  .get('/similar', async (req, res) => {
    const { id } = req.query;
    const { ikeaShopId = samaraShopId } = req.cookies;
    const { categoryList } = req.query;

    if (!id || !categoryList) {
      return res.send([]);
    }

    const list = JSON.stringify(categoryList.split(','));
    const url = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/similar/product/${id}?categoryList=${encodeURI(
      list
    )}&details=true&size=24&currency=RUB&filter=[item_id][!=][${id}]&`;

    return fetch(url)
      .then(response => response.json())
      .then(async json => {
        const products = await getProductsFromDB(json.data, 'item_id', ikeaShopId);
        return res.send(products);
      });
  })

  .get('/same', async (req, res) => {
    const { id } = req.query;
    const { ikeaShopId = samaraShopId } = req.cookies;

    if (!id) {
      return res.send([]);
    }

    const data = await getRecommendedProductIds({ productId: id });
    const products = await getProductsFromDB(data, 'itemId', ikeaShopId);

    res.send(products);
  })

  .get('/style', async (req, res) => {
    const { id } = req.query;
    const { ikeaShopId = samaraShopId } = req.cookies;

    if (!id) {
      return res.send([]);
    }

    const data = await getRecommendedProductIdsByUrlScheme({ productId: id });
    const products = getProductsFromDB(data.data.recommended, 'itemId', ikeaShopId);

    res.send(products);
  })

  .get('/series', async (req, res) => {
    const { id } = req.query;
    const { ikeaShopId = samaraShopId } = req.cookies;

    if (!id) {
      return res.send([]);
    }

    const data = await getRecommendedProductIdsByUrlScheme({
      productId: id,
      type: 'series'
    });
    const products = await getProductsFromDB(data, 'itemId', ikeaShopId);

    res.send(products);
  })

  .get('/trending', async (req, res) => {
    const { id } = req.query;
    const { ikeaShopId = samaraShopId } = req.cookies;
    const { categoryList } = req.query;

    if (!id || !categoryList) {
      return res.send([]);
    }

    const list = JSON.stringify(categoryList.split(','));
    const url = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/trending/products?details=true&categoryList=${encodeURI(
      list
    )}&size=16&currency=RUB&`;

    return fetch(url)
      .then(response => response.json())
      .then(async json => {
        const products = await getProductsFromDB(json.data, 'item_id', ikeaShopId);
        return res.send(products);
      });
  });

module.exports = router;
