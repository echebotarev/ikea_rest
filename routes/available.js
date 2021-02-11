const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
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
});

module.exports = router;
