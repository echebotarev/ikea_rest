const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const dayjs = require('dayjs');
const Client = require('./../libs/mongoClient');

const getPrice = require('./../handlers/price');

const getOffer = product => {
  return {
    _attributes: {
      sku: product.identifier
    },
    model: {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    brand: { _text: 'IKEA' },
    price: {
      _text: getPrice(product.price.price.mainPriceProps.price.integer)
    }
  };
};

const createKaspiKzFeed = async () => {
  const products = await Client.get('product');
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
          // проверяем существует ли такая категория
          // есть ли изображения и описание
          // eslint-disable-next-line no-shadow
          offer: (products => {
            const output = [];

            products.map(product => {
              const offer = getOffer(product);
              if (offer) {
                output.push(offer);
              }
            });

            return output;
          })(products)
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
