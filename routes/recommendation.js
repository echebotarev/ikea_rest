// const recIngka =
//   'https://rec.ingka.com/cached-services/ru-prod/items/80382359?filter=allSameCat&n=16&productId=80382359';
// const recApi = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/similar/product/${id}?categoryList=[${encodeURI(
//   categoryList
// )}]&details=true&size=16&currency=RUB&filter=[item_id][!=][${id}]&`;

const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const router = express.Router();

const getRecommendedProductIds = ({ productId, filter = 'allSameCat' }) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://rec.ingka.com/services/ru-prod/items/${productId}?filter=${filter}&n=16&productId=${productId}`
    )
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(e => reject(e));
  });
const getRecommendedProductIdsByStyle = ({ productId }) =>
  new Promise((resolve, reject) => {
    fetch(
      `https://rec.ingka.com/services/ru-prod/items/style/${productId}?n=16&productId=${productId}`
    )
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(e => reject(e));
  });

router
  .get('/similar', async (req, res) => {
    const { id } = req.query;
    const { categoryList } = req.query;

    if (!id || !categoryList) {
      return res.send([]);
    }

    const url = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/similar/product/${id}?categoryList=[${encodeURI(
      categoryList
    )}]&details=true&size=24&currency=RUB&filter=[item_id][!=][${id}]&`;

    return fetch(url)
      .then(response => response.json())
      .then(json => res.send(json));
  })
  .get('/same', async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.send([]);
    }

    const data = await getRecommendedProductIds({ productId: id });
    const ids = data.map(item => ({ identifier: item.itemId }));
    const products = ids.length ? await Client.find(ids) : [];

    res.send(products);
  })
  .get('/style', async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.send([]);
    }

    const data = await getRecommendedProductIdsByStyle({ productId: id });
    console.log('Data', data.data.recommended);

    const ids = data.data.recommended.map(item => ({ identifier: item.itemId }));
    const products = ids.length ? await Client.find(ids) : [];

    res.send(products);
  });

module.exports = router;
