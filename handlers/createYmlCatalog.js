const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const dayjs = require('dayjs');

const Client = require('./../libs/mongoClient');

const { categoriesDict } = require('./../constant');

let xmlCategories = null;
let ids = null;

const Price = require('./../handlers/price');

const getAvailable = require('./../libs/getAvailable');
const calculateAvailable = require('./../utils/calculateAvailable');

const getDeliveryDay = require('./timeToDelivery');
const { samaraShopId } = require("../constant");

const getCategory = (category, parentId = null) => {
  if (category.identifier === 'products' || category.identifier === 'pubdc7bb900') {
    return {
      id: category.identifier,
      data: null
    };
  }

  const id = categoriesDict[category.identifier]
    ? categoriesDict[category.identifier]
    : category.identifier;

  // eslint-disable-next-line no-param-reassign
  parentId = categoriesDict[parentId] ? categoriesDict[parentId] : parentId;

  return {
    id,
    data: {
      _attributes: Object.assign({ id }, parentId ? { parentId } : {}),
      _text: category.title
    }
  };
};
const getCategories = categories => {
  const usedIds = [];
  const ymlCategories = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const dataCategory = getCategory(category);
    if (!usedIds.includes(dataCategory.id) && dataCategory.data) {
      ymlCategories.push(dataCategory.data);
      usedIds.push(dataCategory.id);
    }

    if (!category.subcategories || !dataCategory.data) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < category.subcategories.length; j++) {
      const subcategory = category.subcategories[j];
      const dataSubcategory = getCategory(subcategory, category.identifier);
      if (!usedIds.includes(dataSubcategory.id) && dataSubcategory.data) {
        ymlCategories.push(dataSubcategory.data);
        usedIds.push(dataSubcategory.id);
      }
    }
  }

  // возвращаем массив ID, чтобы проверять существующие категории
  // при создании массива офферов
  return { ymlCategories, usedIds };
};

const getOffer = product => {
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
      .map(image => ({
        _text: image.content.url
      }));

  let id = getIdFromUrl(getParent(product.breadcrumbs).item);
  id = categoriesDict[id] ? categoriesDict[id] : id;

  if (!product.images) {
    return null;
  }

  return {
    _attributes: {
      id: product.identifier,
      available: 'true'
    },
    name: {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    url: {
      _text: `https://doma-doma.org/product/${product.identifier}`
    },
    price: {
      _text: Price.getPrice(product.price.price.mainPriceProps.price.integer)
    },
    description: {
      _text: product.summary_description || ''
    },
    currencyId: {
      _text: 'KZT'
    },
    categoryId: {
      _text: id || ''
    },
    param: getParams(product),
    picture: getPictures(product.images.fullMediaList)
  };
};
const getOffers = async (products, acc = []) => {
  if (products.length === 0) {
    return acc;
  }

  const product = products.splice(0, 1)[0];

  const available = await getAvailable({
    type: product.utag.product_type,
    id: product.identifier,
    ikeaShopId: samaraShopId
  });
  const availableValue = calculateAvailable(available);
  const offer = getOffer(product);

  // проверяем существует ли такая категория
  // есть ли изображения и описание
  if (
    availableValue &&
    offer &&
    // eslint-disable-next-line no-underscore-dangle
    ids.includes(offer.categoryId._text) &&
    // eslint-disable-next-line no-underscore-dangle
    offer.description._text &&
    offer.picture.length
  ) {
    acc.push(offer);
  }

  return getOffers(products, acc);
};

const createYmlCatalog = async (categories, products) => {
  const offers = await getOffers(products);

  const result = convert.json2xml(
    {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8'
        }
      },
      yml_catalog: {
        _attributes: {
          date: dayjs().add(3, 'hour').format('YYYY-MM-DD HH-mm')
        },
        shop: {
          name: {
            _text: 'Doma-Doma.org'
          },
          company: {
            _text: 'ИП Егор Чеботарев'
          },
          url: {
            _text: 'https://aktau.doma-doma.org/'
          },
          currencies: {
            currency: {
              _attributes: {
                id: 'KZT',
                rate: 1
              }
            }
          },
          categories: {
            category: xmlCategories
          },
          'delivery-options': {
            option: {
              _attributes: {
                cost: 0,
                days: getDeliveryDay('001').daysToDelivery
              }
            }
          },
          offers: {
            offer: offers
          }
        }
      }
    },
    { compact: true, spaces: 4 }
  );

  // console.log('Res', result);
  fs.writeFile(
    path.join(__dirname, '../static', 'yml_catalog.xml'),
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
  const categories = await Client.get('category');
  const products = await Client.get('product');

  const { ymlCategories, usedIds } = getCategories(categories);
  xmlCategories = ymlCategories;
  ids = usedIds;

  await createYmlCatalog(categories, products);
}, 2000);
