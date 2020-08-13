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
    const url = `${config.get('availableUrl')}?url=${req.query.url}`;
    fetch(url)
      .then(response => response.json())
      .then(json => res.send(json));
  });

module.exports = router;
