const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const { samaraShopId, aktauShopId } = require('./../constant');

const sgMail = require('./../libs/sgmail');
const getDeliveryDay = require('./../handlers/timeToDelivery');
const getSearchedProducts = require('./../utils/getSearchedProducts');
const getAvailable = require('../libs/getAvailable');
const mergeProductsWithAvailables = require('../utils/mergeProductsWithAvailables');
const getProductsFromDB = require('./../utils/getProductsFromDB');

const router = express.Router();

const getProducts = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (
          json.reason &&
          json.reason.includes('pubdc7bb900') === false &&
          (json.code === 400 || json.code === 404) &&
          json.status !== 'Not Found'
        ) {
          sgMail(
            'sik.search.blue.cdtapps.com',
            `Что-то не так с запросом ${url}, \r\nStatus: ${json.status}, \r\nReason: ${json.reason}}`
          );
        }

        return resolve(json);
      })
      .catch(e => reject(e));
  });
const getQueries = payload =>
  Object.entries(payload).reduce(
    (acc, [key, value], index, array) =>
      key === 'id' ||
      key === 'page' ||
      key.includes('utm_') ||
      key === 'gclid' ||
      key === 'yclid' ||
      key === 'ymclid' ||
      key === 'fbclid'
        ? acc
        : `${acc}${key}=${value}${index === array.length - 1 ? '' : '&'}`,
    ''
  );

router
  .get('/category/:categoryId', async (req, res) => {
    const category = await Client.findOne(req.params.categoryId, 'category');
    res.send(category);
  })

  .get('/product/:productId', async (req, res) => {
    const product = await Client.findOne(req.params.productId, 'product');
    res.send(product);
  })

  .get('/products/:categoryId', async (req, res) => {
    const PER_PAGE = 24;
    const { categoryId } = req.params;
    const { ikeaShopId = samaraShopId } = req.cookies;
    const page = parseInt(req.query.page, 10);

    console.log('REST - /products/:categoryId - ikeaShopId', ikeaShopId);
    console.log('COOKIE - /products/:categoryId', req.cookies);
    console.log('=====================');

    req.query.sort = req.query.sort || 'RELEVANCE';
    const queries = encodeURI(getQueries(req.query)).replace(/,/g, '%2C');

    let result = {},
      ids = [];
    if (page && page !== 1) {
      const end = page * PER_PAGE;
      const start = end - PER_PAGE;

      const resultProducts = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${categoryId}&size=24&${queries}`
      );
      const resultMoreProducts = await getProducts(
        `http://sik.search.blue.cdtapps.com/ru/ru/product-list-page/more-products?&category=${categoryId}&start=${start}&end=${end}&${queries}`
      );

      result = Object.assign(
        {},
        resultProducts.productListPage,
        resultMoreProducts.moreProducts
      );
      ids = result.productWindow.map(p => ({ identifier: p.id }));
      result.productWindow = await Client.find(ids);
    } else {
      const products = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?size=24&category=${categoryId}&${queries}`
      );

      // const result = await getProducts('https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?sessionId=a2bf2828-1b03-475f-a625-20a055042603&category=fu002&sort=PRICE_LOW_TO_HIGH&size=24&f-special-price=true&c=lf&v=20201204');

      if (!products.productListPage) {
        /**
         * Ответ типа
         * result: {
            code: 404,
            status: 'Not Found',
            reason: 'Unknown category key: pubdc7bb900'
          }
         * */
        return res.send(products);
      }

      ids = products.productListPage.productWindow.map(p => ({
        identifier: p.id
      }));
      result = Object.assign(products.productListPage, {
        productWindow: await Client.find(ids)
      });
    }

    const time = Date.now();
    const availables = await getAvailable({
      products: result.productWindow,
      ikeaShopId
    });
    console.log(`Time for get Availables: ${Date.now() - time} ms`);

    result.productWindow = mergeProductsWithAvailables(
      result.productWindow,
      availables
    );

    res.send(result);
  })

  .get('/products', async (req, res) => {
    let { ids } = req.query;
    // eslint-disable-next-line array-callback-return
    ids = ids.split(',').map(id => ({ identifier: id }));

    const products = await Client.find(ids);
    res.send(products);
  })

  .get('/search/products', async (req, res) => {
    let url = `https://sik.search.blue.cdtapps.com/ru/ru/search-result-page?max-num-filters=8&q=${encodeURI(
      req.query.q
    )}&autocorrect=true&size=96&columns=4&store=442&subcategories-style=tree-navigation&columns=%26columns%3D4&c=sr&v=20210317&types=PRODUCT%2CCONTENT`;

    fetch(url)
      .then(response => response.json())
      .then(async json => {
        const data = getSearchedProducts(json);
        const ids = data.map(p =>
          p.type === 'PRODUCT'
            ? { identifier: p.product.id }
            : { identifier: null }
        );

        const products = await getProductsFromDB(ids);

        return res.send(products);
      });
  })

  .get('/search', async (req, res) => {
    fetch(
      `https://sik.search.blue.cdtapps.com/ru/ru/search-box?q=${encodeURI(
        req.query.q
      )}`
    )
      .then(response => response.json())
      .then(json => res.send(json));
  })

  .get('/time-to-delivery', (req, res) => {
    let { domaDomaShopId = aktauShopId } = req.cookies;
    domaDomaShopId = domaDomaShopId === 'undefined' ? aktauShopId : domaDomaShopId;

    console.log('REST - /time-to-delivery - domaDomaShopId', domaDomaShopId);

    // TODO: пока мы толком не знаем как будут происходить поставки в Уральск
    if (domaDomaShopId === '003') {
      return res.send({});
    }

    const deliveryDay = getDeliveryDay(domaDomaShopId);
    res.send(deliveryDay);
  })

  .get('/sale/:campaign', (req, res) => {
    const DISCOUNTS = {
      'lost-basket': { type: 'percent', value: 5 }
    };

    res.json(DISCOUNTS[req.params.campaign]);
  });

module.exports = router;
