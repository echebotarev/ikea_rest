const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const dayjs = require('dayjs');
const Client = require('./../libs/mongoClient');

const { samaraShopId } = require('./../constant');

const getPrice = require('./../handlers/price');
const getAvailable = require('./../libs/getAvailable');
const calculateAvailable = require('./../utils/calculateAvailable');
const getDeliveryDay = require('./timeToDelivery');

const { daysToDelivery } = getDeliveryDay('001');

const timeout = require('./../libs/timeout');

let Yes = 0;
let No = 0;

const getOffer = async product => {
  const available = await getAvailable({
    type: product.utag.product_type,
    id: product.identifier,
    ikeaShopId: samaraShopId
  });
  const testAvailableValue = calculateAvailable(available) ? 'yes' : 'no';
  // eslint-disable-next-line no-unused-expressions,no-plusplus
  testAvailableValue === 'yes' ? Yes++ : No++;

  const availableValue = 'no';

  return {
    _attributes: {
      sku: product.identifier
    },
    model: {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    brand: { _text: 'IKEA' },
    availabilities: {
      availability: {
        _attributes: {
          available: availableValue,
          storeId: 'PP1',
          preOrder: daysToDelivery.toString()
        }
      }
    },
    price: {
      _text: getPrice(product.price.price.mainPriceProps.price.integer)
    }
  };
};
const getOffers = async (products, acc = []) => {
  console.log(`Yes: ${Yes}; No: ${No}`);

  if (products.length === 0) {
    return acc;
  }

  const result = await getOffer(products.splice(0, 1)[0]);
  await timeout(100);

  // eslint-disable-next-line no-underscore-dangle
  if (result.price._text > 5000) {
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
        company: { _text: 'Doma-Doma' },
        merchantid: { _text: 'Domadoma' },
        offers: {
          offer: offers
        }
      }
    },
    { compact: true, spaces: 4 }
  );

  // console.log('Res', result);
  fs.writeFile(
    path.join(__dirname, '../static', 'kaspi-kz-feed.xml'),
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
