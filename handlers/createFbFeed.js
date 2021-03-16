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
    'g:google_product_category':
      googleCategoriesIdDict[product.utag.category] || null,
    'g:brand': 'IKEA'
  };
};

const createFbFeed = async (minPrice = 0, maxPrice = 0) => {
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
            return products
              .map(product => getItem(product))
              .filter(offer => {
                if (
                  offer &&
                  offer['g:description']._text &&
                  offer['g:image_link']
                ) {
                  if (minPrice || maxPrice) {
                    return (
                      parseInt(offer['g:price']._text) > minPrice &&
                      parseInt(offer['g:price']._text) <= maxPrice
                    );
                  }

                  return true;
                }

                return false;
              });
          })(products)
        }
      }
    },
    { compact: true, spaces: 4 }
  );

  let fileName = 'fb_feed_aktau';
  if (minPrice || maxPrice) {
    fileName = `${fileName}-minPrice-${minPrice}-maxPrice-${maxPrice}`;
  }

  fs.writeFile(
    path.join(__dirname, '../static', `${fileName}.xml`),
    result,
    err => {
      if (err) {
        return console.error(err);
      }

      console.log('Ok');
      return true;
    }
  );
};

setTimeout(async () => {
  await createFbFeed();
  await createFbFeed(0, 5000);
  await createFbFeed(5000, 10000);
  await createFbFeed(10000, 20000);
  await createFbFeed(20000, 30000);
  await createFbFeed(30000, 50000);
  await createFbFeed(50000, 10000000);

  setTimeout(() => process.exit(), 10000);
}, 2000);
