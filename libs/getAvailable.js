const axios = require('axios');
const config = require('../libs/config');

const apiClient = axios.create({
  baseURL: config.get('availableUrl'),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

module.exports = async payload => {
  if (Array.isArray(payload)) {
    return await apiClient
      .post('/products', { products: payload })
      .then(response => (response.data ? response.data : []));
  } else {
    const { type, id } = payload;
    return await apiClient
      .get(`/product?type=${type}&id=${id}`)
      .then(response => (response.data ? response.data : {}));
  }
};
