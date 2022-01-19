const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const Client = require('./../libs/mongoClient');

const shopIds = process.argv.slice(2);
const { domainNames } = require('./../constant');

const leadingZero = value =>
  value.toString().length === 1 ? `0${value}` : value;
const getSitemapUrls = (domain, categories, products) => {
  // eslint-disable-next-line no-shadow
  const getUrl = ({ path, date }) => ({
    loc: {
      _text: domain
        ? `https://${domain}.doma-doma.org/${path}`
        : `https://doma-doma.org/${path}`
    },
    lastmod: {
      _text: date
    },
    changefreq: {
      _text: 'weekly'
    }
  });

  const d = new Date();
  const date = `${d.getFullYear()}-${leadingZero(
    d.getMonth() + 1
  )}-${leadingZero(d.getDate())}`;

  const urls = [
    {
      loc: {
        _text: domain
          ? `https://${domain}.doma-doma.org/`
          : `https://doma-doma.org/`
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
const createSitemap = async domain => {
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
        url: getSitemapUrls(domain, categories, products)
      }
    },
    { compact: true, spaces: 4 }
  );

  // console.log('Res', result);
  fs.writeFile(
    path.join(
      __dirname,
      '../static',
      domain ? `sitemap-${domain}.xml` : 'sitemap.xml'
    ),
    result,
    err => {
      if (err) {
        return console.error(err);
      }

      console.log('Ok');
      // return process.exit();
    }
  );
};

const createSitemaps = async domains => {
  if (domains.length === 0) {
    return true;
  }

  const domain = domains.splice(0, 1)[0];
  await createSitemap(domain);

  return createSitemaps(domains);
};

setTimeout(async () => {
  if (shopIds.length) {
    await createSitemaps(shopIds.map(id => domainNames[id]));
  } else {
    await createSitemap();
  }

  setTimeout(process.exit, 2000);
}, 2000);
