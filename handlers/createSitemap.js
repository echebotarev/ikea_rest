const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const Client = require('./../libs/mongoClient');

const getSitemapUrls = (categories, products) => {
  // eslint-disable-next-line no-shadow
  const getUrl = ({ path, date }) => ({
    loc: {
      _text: `https://doma-doma.kz/${path}`
    },
    lastmod: {
      _text: date
    },
    changefreq: {
      _text: 'weekly'
    }
  });

  const d = new Date();
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  const urls = [
    {
      loc: {
        _text: 'https://doma-doma.kz/'
      },
      lastmod: {
        _text: date
      },
      changefreq: {
        _text: 'weekly'
      }
    }
  ];

  categories.forEach(category =>
    urls.push(getUrl({ path: `category/${category.identifier}`, date }))
  );
  products.forEach(product =>
    urls.push(getUrl({ path: `product/${product.identifier}`, date }))
  );

  return urls;
};
const createSitemap = async () => {
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
      urlset: {
        _attributes: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
        },
        url: getSitemapUrls(categories, products)
      }
    },
    { compact: true, spaces: 4 }
  );

  // console.log('Res', result);
  fs.writeFile(
    path.join(__dirname, '../static', 'sitemap.xml'),
    result,
    err => {
      if (err) {
        return console.error(err);
      }

      return console.log('Ok');
    }
  );
};

setTimeout(async () => {
  await createSitemap();

  process.exit();
}, 2000);
