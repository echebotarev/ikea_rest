const fetch = require('node-fetch');
const config = require('../libs/config');

const handleError = require('./handleError');

module.exports = async ({ type, id }) => {
  const url = `${config.get('availableUrl')}/product?type=${type}&id=${id}`;
  // eslint-disable-next-line no-return-await
  return await fetch(url)
    .then(response => response.json())
    .catch((err) => {
      handleError(err);
      return {};
    });
};
