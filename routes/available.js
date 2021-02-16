const express = require('express');
const getAvailableProduct = require('../libs/getAvailableProduct');

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
  const result = await getAvailableProduct({
    shopId: samaraShopId, type, id
  });

  return res.send(result);
});

module.exports = router;
