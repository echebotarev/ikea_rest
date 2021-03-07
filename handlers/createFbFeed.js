const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const Client = require('./../libs/mongoClient');

const { categoriesDict, googleCategoriesIdDict } = require('./../constant');

const getPrice = require('./../handlers/price');

const getItem = product => {
  const getIdFromUrl = (url, separator = '-') => {
    if (!url) {
      return null;
    }

    const arr = url.split(separator);
    return arr[arr.length - 1].trim().replace('/', '');
  };
  const getParent = breadcrumbs => {
    if (
      !breadcrumbs ||
      !breadcrumbs.itemListElement ||
      !breadcrumbs.itemListElement.length
    ) {
      return {};
    }

    const len = breadcrumbs.itemListElement.length;
    return len ? breadcrumbs.itemListElement[len - 2] : {};
  };
  const getParams = product => {
    const dimensions =
      product.information.dimensionProps &&
      product.information.dimensionProps.dimensions;

    if (dimensions && dimensions.length) {
      return dimensions.map(dimension => ({
        _attributes: {
          name: dimension.name,
          unit: 'см'
        },
        _text: parseInt(dimension.measure, 10)
      }));
    }

    return [];
  };
  const getPictures = images =>
    images
      .filter(image => image.type === 'image')
      .map(image => image.content.url);

  let id = getIdFromUrl(getParent(product.breadcrumbs).item);
  id = categoriesDict[id] ? categoriesDict[id] : id;

  if (!product.images) {
    return null;
  }

  return {
    'g:id': {
      _text: product.identifier
    },
    'g:title': {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    'g:link': {
      _text: `https://doma-doma.kz/product/${product.identifier}`
    },
    'g:price': {
      _text: `${getPrice(product.price.price.mainPriceProps.price.integer)} KZT`
    },
    'g:description': {
      _text: product.summary_description || ''
    },
    'g:condition': {
      _text: 'new'
    },
    'g:availability': {
      _text: 'in stock'
    },
    'g:image_link': {
      _text: getPictures(product.images.fullMediaList)[0]
    },
    'g:google_product_category': googleCategoriesIdDict[product.utag.category] || null
  };
};

const createFbFeed = async () => {
  const products = await Client.get('product');

  const result = convert.json2xml(
    {
      _declaration: {
        _attributes: {
          version: '1.0'
        }
      },
      rss: {
        _attributes: {
          'xmlns:g': 'http://base.google.com/ns/1.0',
          version: '2.0'
        },
        channel: {
          title: {
            _text: 'Doma-Doma.kz'
          },
          link: {
            _text: 'https://doma-doma.kz/'
          },
          description: {
            _text: 'Сервис по доставке IKEA прямо к вам домой'
          },
          item: (products => {
            const output = [];

            products.map((product) => {
              const offer = getItem(product);
              if (
                offer &&
                offer['g:description']._text &&
                offer['g:image_link']
              ) {
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

  fs.writeFile(
    path.join(__dirname, '../static', 'fb_feed_aktau.xml'),
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
  await createFbFeed();
}, 2000);
