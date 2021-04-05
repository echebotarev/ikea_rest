const Client = require('./../libs/mongoClient');

const getAvailable = require('../libs/getAvailable');
const mergeProductsWithAvailables = require('../utils/mergeProductsWithAvailables');

module.exports = async (data, idName, ikeaShopId) => {
  const ids = idName
    ? data.length && data.map
      ? data.map(item => ({
          identifier: item[idName]
        }))
      : []
    : data;
  let products = ids.length ? await Client.find(ids) : [];

  const time = Date.now();
  const availables = await getAvailable({ products, ikeaShopId });
  console.log(`Time for get Availables ${products.length} items: ${Date.now() - time} ms`);

  products = mergeProductsWithAvailables(products, availables);

  return products;
};
