const badProducts = require('./../utils/kaspi/bad-products');

const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const dayjs = require('dayjs');
const Client = require('./../libs/mongoClient');

const { samaraShopId } = require('./../constant');

const getShopIdFromArgs = require('./../utils/kaspi/getShopIdFromArgs');

const SHOP_ID = getShopIdFromArgs(process.argv);

const getPrice = require('./../handlers/price');
const getAvailable = require('./../libs/getAvailable');
const calculateAvailable = require('./../utils/calculateAvailable');
const getDeliveryDay = require('./timeToDelivery');

const getAvailabilities = async (product, shopId = '001') => {
  const available = await getAvailable({
    type: product.utag.product_type,
    id: product.identifier,
    ikeaShopId: samaraShopId
  });
  const availableValue = calculateAvailable(available) ? 'yes' : 'no';

  switch (shopId) {
    case '001':
      return [
        {
          _attributes: {
            available: availableValue,
            storeId: 'PP1',
            // preOrder: daysToDelivery.toString()
            preOrder: '15'
          }
        },
        {
          _attributes: {
            available: availableValue,
            storeId: 'PP2',
            // preOrder: daysToDelivery.toString()
            preOrder: '15'
          }
        }
      ];

    case '004':
      return [
        {
          _attributes: {
            available: availableValue,
            storeId: 'PP1',
            // preOrder: daysToDelivery.toString()
            preOrder: '15'
          }
        }
      ];

    default:
      return [];
  }
};
const getCityPrices = (product, shopId = '001') => {
  switch (shopId) {
    case '001':
      return [
        {
          // Актау
          _attributes: { cityId: '471010000' },
          _text: getPrice(product.price.price.mainPriceProps.price.integer)
        },
        {
          // Уральск
          _attributes: { cityId: '271010000' },
          _text: getPrice(
            product.price.price.mainPriceProps.price.integer,
            '003'
          )
        }
      ];

    case '004':
      return [
        {
          // Атырау
          _attributes: { cityId: '231010000' },
          _text: getPrice(
            product.price.price.mainPriceProps.price.integer,
            '004'
          )
        }
      ];

    default:
      return [];
  }
};

const { daysToDelivery } = getDeliveryDay('001');

const timeout = require('./../libs/timeout');

const getOffer = async product => {
  if (badProducts.includes(product.identifier)) {
    return null;
  }

  return {
    _attributes: {
      sku: product.identifier
    },
    model: {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    brand: { _text: 'IKEA' },
    availabilities: {
      availability: getAvailabilities(product, SHOP_ID)
    },
    cityprices: {
      cityprice: getCityPrices(product, SHOP_ID)
    }
  };
};
const getOffers = async (products, acc = []) => {
  if (products.length === 0) {
    return acc;
  }

  const result = await getOffer(products.splice(0, 1)[0]);
  await timeout(100);

  // eslint-disable-next-line no-underscore-dangle
  if (result && result.cityprices.cityprice[0]._text > 6500) {
    acc.push(result);
  }
  // eslint-disable-next-line no-return-await
  return await getOffers(products, acc);
};

const createKaspiKzFeed = async () => {
  const products = await Client.get('product');
  const offers = await getOffers(products);
  const result = convert.json2xml(
    {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8'
        }
      },
      kaspi_catalog: {
        _attributes: {
          date: dayjs()
            .add(3, 'hour')
            .format('YYYY-MM-DD HH-mm'),
          xmlns: 'kaspiShopping',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation':
            'kaspiShopping http://kaspi.kz/kaspishopping.xsd'
        },
        company: { _text: SHOP_ID === '004' ? 'IDEA в DOM' : 'Doma-Doma' },
        merchantid: { _text: SHOP_ID === '004' ? '4876008' : 'Domadoma' },
        offers: {
          offer: offers
        }
      }
    },
    { compact: true, spaces: 4 }
  );

  // console.log('Res', result);
  fs.writeFile(
    path.join(__dirname, '../static', SHOP_ID === '004' ? 'kaspi-kz-feed-004.xml' : 'kaspi-kz-feed.xml'),
    result,
    err => {
      if (err) {
        return console.error(err);
      }

      console.log('Ok');
      return process.exit();
    }
  );
};

setTimeout(async () => {
  await createKaspiKzFeed();
}, 2000);
