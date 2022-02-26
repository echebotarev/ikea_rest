// eslint-disable-next-line no-unused-vars
const mongoose = require('./../libs/connectMongoose');

// база данных товаров
const mongoClient = require('./../libs/mongoClient');

const shopIds = require('./../constant').kaspiShopIds;
const Price = require('./../handlers/price');

const managePrices = async products => {
  if (products.length === 0) {
    return true;
  }

  const product = products.splice(0, 1)[0];

  let [price001, price003, price004] = [null, null, null];
  try {
    [price001, price003, price004] = await Promise.all(
      shopIds.map(shopId => Price.getLowerPrice(product, shopId))
    );
  } catch (e) {
    return managePrices(products);
  }

  await mongoClient.findAndUpdate(
    { identifier: product.identifier },
    {
      $set: {
        kaspiPrices: {
          '001': price001,
          '003': price003,
          '004': price004
        }
      }
    }
  );

  return managePrices(products);
};

setTimeout(async () => {
  const products = await mongoClient.get('product');
  await managePrices(products);
  console.log('Updated Prices');

  process.exit();
}, 2000);
