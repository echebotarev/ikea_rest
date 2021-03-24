const Client = require('./../libs/mongoClient');

const getAvailable = require('../libs/getAvailable');
const mergeProductsWithAvailables = require('../utils/mergeProductsWithAvailables');

module.exports = async (data, idName) => {
  const ids = data.length && data.map ? data.map(item => ({
    identifier: item[idName]
  })) : [];
  let products = ids.length ? await Client.find(ids) : [];

  const time = Date.now();
  const availables = await getAvailable(products);
  console.log(`Time for get Availables: ${Date.now() - time} ms`);

  products = mergeProductsWithAvailables(products, availables);

  return products;
};
