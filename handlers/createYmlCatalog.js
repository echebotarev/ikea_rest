const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const Client = require('./../libs/mongoClient');

const { categoriesDict } = require('./../constant');

const getPrice = require('./../handlers/price');

const getCategory = (category, parentId = null) => {
  if (category.identifier === 'products') {
    return {
      id: category.identifier,
      data: null
    };
  }

  const id = categoriesDict[category.identifier] ?
    categoriesDict[category.identifier] :
    category.identifier;

  // eslint-disable-next-line no-param-reassign
  parentId = categoriesDict[parentId] ? categoriesDict[parentId] : parentId;

  return {
    id,
    data: {
      _attributes: Object.assign(
        { id },
        parentId ? { parentId } : {}
      ),
      _text: category.title
    }
  };
};
const getCategories = categories => {
  const usedIds = [];
  const xmlCategories = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const dataCategory = getCategory(category);
    if (!usedIds.includes(dataCategory.id) && dataCategory.data) {
      xmlCategories.push(dataCategory.data);
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
        xmlCategories.push(dataSubcategory.data);
        usedIds.push(dataSubcategory.id);
      }
    }
  }

  return xmlCategories;
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
    if (!breadcrumbs || !breadcrumbs.itemListElement) {
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

  return {
    _attributes: {
      id: product.identifier
    },
    name: {
      _text: `${product.price.productDescription}, IKEA, ${product.price.productName}, ${product.price.measurementText}`
    },
    url: {
      _text: `https://doma-doma.kz/product/${product.identifier}`
    },
    price: {
      _text: getPrice(product.price.price.mainPriceProps.price.integer)
    },
    description: {
      _text: product.summary_description
    },
    currencyId: {
      _text: 'KZT'
    },
    categoryId: {
      _text: id
    },
    param: getParams(product),
    picture: getPictures(product.images.fullMediaList)
  };
};
const getOffers = products => products.map(getOffer);

const createYmlCatalog = async () => {
  const d = new Date();
  const minutes = d.getMinutes();

  const categories = await Client.get('category');
  const products = await Client.get('product');

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
          date: `${d.getFullYear()}-${d.getMonth() +
            1}-${d.getDate()} ${d.getHours()}:${
            minutes < 10 ? `0${minutes}` : minutes
          }`
        },
        shop: {
          name: {
            _text: 'Doma-Doma.kz'
          },
          company: {
            _text: 'ИП Егор Чеботарев'
          },
          url: {
            _text: 'https://doma-doma.kz/'
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
            category: getCategories(categories)
          },
          'delivery-options': {
            option: {
              _attributes: {
                cost: 0,
                days: 7
              }
            }
          },
          offers: {
            offer: getOffers(products)
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

      return console.log('Ok');
    }
  );
};

setTimeout(createYmlCatalog, 2000);
