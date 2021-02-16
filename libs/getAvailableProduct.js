const fetch = require('node-fetch');
const { samaraShopId } = require('../constant');

module.exports = payload =>
  new Promise((resolve, reject) => {
    /**
     * Возможно время от времение надо менять Contract и Consumer'a
     * Эти данные можно посмотреть в
     * window.Checkout.settings.shoppinglist.contract
     * window.Checkout.settings.shoppinglist.consumer
     * */

    const { shopId = samaraShopId, type, id } = payload;
    const url = `https://iows.ikea.com/retail/iows/ru/ru/stores/${shopId}/availability/${type}/${id.replace('s', '')}`;
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
      .then(json => resolve(json))
      .catch(err => reject(err));
  });
