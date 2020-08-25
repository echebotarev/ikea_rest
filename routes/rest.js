const express = require('express');
const fetch = require('node-fetch');
const config = require('./../libs/config');
const Client = require('./../libs/mongoClient');

const router = express.Router();

const getProducts = url =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(e => reject(e));
  });

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

    if (page && page !== 1) {
      const end = page * PER_PAGE;
      const start = end - PER_PAGE;

      const resultProducts = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${categoryId}&sort=RELEVANCE&size=24&subcategories-style=tree-navigation&c=plp`
      );
      const resultMoreProducts = await getProducts(
        `http://sik.search.blue.cdtapps.com/ru/ru/product-list-page/more-products?&category=${categoryId}&sort=RELEVANCE&start=${start}&end=${end}&c=plp`
      );

      res.send(
        Object.assign(
          {},
          resultProducts.productListPage,
          resultMoreProducts.moreProducts
        )
      );
    } else {
      const result = await getProducts(
        `https://sik.search.blue.cdtapps.com/ru/ru/product-list-page?category=${categoryId}&sort=RELEVANCE&size=24&subcategories-style=tree-navigation&c=plp`
      );
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
      .then(json => res.send(json));
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

    const { type } = req.query;
    const id = req.query.id.replace('s', '');
    const url = `https://iows.ikea.com/retail/iows/ru/ru/stores/524/availability/${type}/${id}`;
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

  .get('/recommendations', async (req, res) => {
    const { id } = req.query;
    const { categoryList } = req.query;

    if (!id || !categoryList) {
      return res.send([]);
    }

    const url = `https://recommendation.api.useinsider.com/10002692/ru_RU:0JzQvtGB0LrQstCw/complementary/product/${id}?categoryList=[${encodeURI(categoryList)}]&details=true&size=16&currency=RUB&filter=[item_id][!=][${id}]&`;

    return fetch(url)
      .then(response => response.json())
      .then(json => res.send(json));
  });

module.exports = router;
