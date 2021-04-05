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
  if (Array.isArray(payload.products)) {
    return payload.products.length === 0
      ? payload.products
      : await apiClient
          .post('/products', {
            products: payload.products,
            ikeaShopId: payload.ikeaShopId
          })
          .then(response => (response.data ? response.data : []));
  } else {
    const { type, id, ikeaShopId, shopId } = payload;
    return await apiClient
      .get(`/product?type=${type}&id=${id}&ikeaShopId=${ikeaShopId || shopId}`)
      .then(response => (response.data ? response.data : {}));
  }
};
