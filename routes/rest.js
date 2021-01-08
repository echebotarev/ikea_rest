const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const sgMail = require('./../libs/sgmail');
const getDeliveryDay = require('./../handlers/timeToDelivery');

const router = express.Router();

const getProducts = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.code === 400 || json.code === 404) {
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
    const page = parseInt(req.query.page, 10);

    const queries = encodeURI(getQueries(req.query)).replace(/,/g, '%2C');

    if (page && page !== 1) {
      const end = page * PER_PAGE;
      const start = end - PER_PAGE;

      const resultProducts = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${categoryId}&size=24&${queries}`
      );
      const resultMoreProducts = await getProducts(
        `http://sik.search.blue.cdtapps.com/ru/ru/product-list-page/more-products?&category=${categoryId}&start=${start}&end=${end}&${queries}`
      );

      const result = Object.assign(
        {},
        resultProducts.productListPage,
        resultMoreProducts.moreProducts
      );
      const ids = result.productWindow.map(p => ({ identifier: p.id }));
      result.productWindow = await Client.find(ids);

      res.send(result);
    } else {
      const result = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${categoryId}&size=24&${queries}`
      );

      if (!result.productListPage) {
        /**
         * Ответ типа
         * result: {
            code: 404,
            status: 'Not Found',
            reason: 'Unknown category key: pubdc7bb900'
          }
         * */
        return res.send(result);
      }

      const ids = result.productListPage.productWindow.map(p => ({
        identifier: p.id
      }));
      result.productListPage.productWindow = await Client.find(ids);

      res.send(result.productListPage);
    }
  })

  .get('/products', async (req, res) => {
    let { ids } = req.query;
    // eslint-disable-next-line array-callback-return
    ids = ids.split(',').map(id => ({ identifier: id }));

    const products = await Client.find(ids);
    res.send(products);
  })

  .get('/search/products', async (req, res) => {
    fetch(
      `https://sik.search.blue.cdtapps.com/ru/ru/search-result-page?q=${encodeURI(
        req.query.q
      )}`
    )
      .then(response => response.json())
      .then(async json => {
        const ids = json.searchResultPage.productWindow.map(p => ({
          identifier: p.id
        }));
        const products = await Client.find(ids);
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

  .get('/available', async (req, res) => {
    /**
     * Возможно время от времение надо менять Contract и Consumer'a
     * Эти данные можно посмотреть в
     * window.Checkout.settings.shoppinglist.contract
     * window.Checkout.settings.shoppinglist.consumer
     * */

    const internetShopId = 604;
    const samaraShopId = 442;

    const { type } = req.query;
    const id = req.query.id.replace('s', '');
    const url = `https://iows.ikea.com/retail/iows/ru/ru/stores/${samaraShopId}/availability/${type}/${id}`;
    fetch(url, {
      headers: {
        Authority: 'iows.ikea.com',
        Accept: 'application/vnd.ikea.iows+json;version=1.0',
        Origin: 'https://order.ikea.com',
        Consumer: 'MAMMUT',
        Contract: '37249'
      }
    })
      .then(response => response.json())
      .then(json => res.send(json));
  })

  .get('/time-to-delivery', (req, res) => {
    const deliveryDay = getDeliveryDay();
    res.send(deliveryDay);
  })

  .get('/sale/:campaign', (req, res) => {
    const DISCOUNTS = {
      'lost-basket': { type: 'percent', value: 5 }
    };

    res.json(DISCOUNTS[req.params.campaign]);
  });

module.exports = router;
