const express = require('express');
const fetch = require('node-fetch');
const Client = require('./../libs/mongoClient');

const sgMail = require('./../libs/sgmail');
const getDeliveryDay = require('./../handlers/timeToDelivery');
const getSearchedProducts = require('./../utils/getSearchedProducts');
const getAvailableProducts = require('../libs/getAvailableProduct');

const router = express.Router();

const getProducts = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (
          json.reason &&
          json.reason.includes('pubdc7bb900') === false &&
          (json.code === 400 || json.code === 404)
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
    const page = parseInt(req.query.page, 10);

    req.query.sort = req.query.sort || 'RELEVANCE';
    const queries = encodeURI(getQueries(req.query)).replace(/,/g, '%2C');

    let result = {};
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
      const ids = result.productWindow.map(p => ({ identifier: p.id }));
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

      const ids = products.productListPage.productWindow.map(p => ({
        identifier: p.id
      }));
      result = Object.assign(products.productListPage, {
        productWindow: await Client.find(ids)
      });
    }

    let availables = result.productWindow.map(product =>
      isNaN(product.available)
        ? getAvailableProducts({
            id: product.identifier,
            type: product.utag.product_type
          })
        : Promise.resolve(null)
    );


    const time = Date.now();
    availables = await Promise.allSettled(availables).then(results =>
      results.map(result =>
        result.status === 'rejected'
          ? console.error(result.reason) && null
          : result.value
      )
    );
    console.log(`Time for get Availables: ${Date.now() - time} ms`);

    const timeToUpdate = Date.now();
    let updatedProducts = availables
      .filter(available => available)
      .map(available =>
        Client.findAndUpdate(
          { identifier: available.id },
          {
            $set: {
              available:
                available.StockAvailability.RetailItemAvailability
                  .AvailableStock.$
            }
          }
        )
      );
    updatedProducts = await Promise.allSettled(updatedProducts).then(results =>
      results.map(result =>
        result.status === 'rejected'
          ? console.error(result.reason) && null
          : result.value
      )
    );
    console.log(`Time for update products: ${Date.now() - timeToUpdate}`);

    const timeToPrepare = Date.now();
    result.productWindow = updatedProducts.length
      ? result.productWindow.map(product =>
          isNaN(product.available)
            ? Object.assign(
                product,
                updatedProducts.find(
                  updatedProduct =>
                    updatedProduct.identifier === product.identifier
                )
              )
            : product
        )
      : result.productWindow;
    console.log(`Time for PREPARE products: ${Date.now() - timeToPrepare}`);

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
    fetch(
      `https://sik.search.blue.cdtapps.com/ru/ru/search-result-page?q=${encodeURI(
        req.query.q
      )}`
    )
      .then(response => response.json())
      .then(async json => {
        const data = getSearchedProducts(json);
        const ids = data.map(p =>
          p.type === 'PRODUCT'
            ? { identifier: p.product.id }
            : { identifier: null }
        );

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
