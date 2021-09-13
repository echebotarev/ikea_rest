const axios = require('axios');
const config = require('../libs/config');

const apiClient = axios.create({
  baseURL: config.get('availableUrl'),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

module.exports = async id =>
  await apiClient
    .get(`/restock?id=${id}`)
    .then(response => (response.data ? response.data : {}));
