const fetch = require('node-fetch');
const config = require('../libs/config');

const handleError = require('./handleError');

module.exports = async payload => {
  let url = null;
  let products = null;

  if (Array.isArray(payload)) {
    url = `${config.get('availableUrl')}/products`;
    products = payload;
  } else {
    const { type, id } = payload;
    url = `${config.get('availableUrl')}/product?type=${type}&id=${id}`;
  }

  // eslint-disable-next-line no-return-await
  return await fetch(url, {
    method: products ? 'POST' : 'GET',
    body: products
  })
    .then(response => response.json())
    .catch(err => {
      handleError(err);
      return {};
    });
};
