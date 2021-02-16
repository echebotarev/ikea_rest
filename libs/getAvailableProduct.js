const fetch = require('node-fetch');

module.exports = payload => new Promise((resolve, reject) => {
  const { shopId, type, id } = payload;
  const url = `https://iows.ikea.com/retail/iows/ru/ru/stores/${shopId}/availability/${type}/${id}`;
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
