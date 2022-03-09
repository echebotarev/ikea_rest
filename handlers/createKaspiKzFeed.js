const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const dayjs = require('dayjs');

const badProducts = require('./../utils/kaspi/bad-products');
const badCategories = require('./../utils/kaspi/bad-categories');

// eslint-disable-next-line no-unused-vars
const mongoose = require('./../libs/connectMongoose');

// база данных товаров
const mongoClient = require('./../libs/mongoClient');

const { samaraShopId } = require('./../constant');

const getShopIdFromArgs = require('./../utils/kaspi/getShopIdFromArgs');

const SHOP_ID = getShopIdFromArgs(process.argv);
console.log('SHOP ID', SHOP_ID);

const Price = require('./../handlers/price');
const getAvailable = require('./../libs/getAvailable');
const calculateAvailable = require('./../utils/calculateAvailable');
const getDeliveryDay = require('./timeToDelivery');

const getDeliveryDayWithCoeff = (shopId, point) => {
  // каспий прибавляет несколько дней к моей дате доставки
  // для нивелирования этого эффекта введен этот коэффициент
  const kaspiDeliveryDayCoeff = {
    '001-PP1': 3,
    '001-PP2': 5,
    '004': 4
  };
  let deliveryDay = getDeliveryDay(shopId).daysToDelivery;
  const coef = kaspiDeliveryDayCoeff[shopId] || kaspiDeliveryDayCoeff[`${shopId}-${point}`];

  if (coef) {
    deliveryDay -= coef;
  }

  return deliveryDay.toString();
};

const getAvailabilities = async (product, shopId = '001') => {
  // const available = await getAvailable({
  //   type: product.utag.product_type,
  //   id: product.identifier,
  //   ikeaShopId: samaraShopId
  // });
  // const availableValue = calculateAvailable(available) ? 'yes' : 'no';
  const availableValue = 'no';

  switch (shopId) {
    case '001':
      return [
        {
          _attributes: {
            available:
              product.identifier === 's09330789' ? 'yes' : availableValue,
            storeId: 'PP1',
            preOrder: getDeliveryDayWithCoeff(shopId, 'PP1')
          }
        },
        {
          _attributes: {
            available: availableValue,
            storeId: 'PP2',
            preOrder: getDeliveryDayWithCoeff(shopId, 'PP2')
          }
        }
      ];

    case '004':
      return [
        {
          _attributes: {
            available: availableValue,
            storeId: 'PP1',
            preOrder: getDeliveryDayWithCoeff(shopId)
          }
        }
      ];

    default:
      return [];
  }
};
const getCityPrices = async (product, shopId = '001') => {
  switch (shopId) {
    case '001':
      // eslint-disable-next-line no-case-declarations
      const price001 = await Price.getLowerPrice(product, '001');

      // eslint-disable-next-line no-case-declarations
      const price003 = await Price.getLowerPrice(product, '003');

      return [
        {
          // Актау
          _attributes: { cityId: '471010000' },
          _text:
            product.identifier === 's09330789'
              ? 375959
              : price001
        },
        {
          // Уральск
          _attributes: { cityId: '271010000' },
          _text: price003
        }
      ];

    case '004':
      // eslint-disable-next-line no-case-declarations
      const price004 = await Price.getLowerPrice(product, '004');

      return [
        {
          // Атырау
          _attributes: { cityId: '231010000' },
          _text: price004
        }
      ];

    default:
      return [];
  }
};

const timeout = require('./../libs/timeout');

const getOffer = async product => {
  if (
    badProducts.includes(product.identifier) ||
    badCategories.includes(product.utag.category)
  ) {
    return null;
  }

  const availability = await getAvailabilities(product, SHOP_ID);
  const cityprice = await getCityPrices(product, SHOP_ID);

  return {
    _attributes: {
      sku: product.identifier
    },
    model: {
      _text: `${product.price.productDescription}, IKEA, ${product.identifier}, ${product.price.productName}, ${product.price.measurementText}`
    },
    brand: { _text: 'IKEA' },
    availabilities: {
      availability
    },
    cityprices: { cityprice }
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
  const products = await mongoClient.get('product');
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
    path.join(
      __dirname,
      '../static',
      SHOP_ID === '004' ? 'kaspi-kz-feed-004.xml' : 'kaspi-kz-feed.xml'
    ),
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
