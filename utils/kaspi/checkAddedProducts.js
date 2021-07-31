/**
 * Проверка id товаров добавленных в базу Kaspi Shop
 * */

const getKaspiProducts = async (url, payload) => {
  const { offers } = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-GWT-Module-Base': '/merchantcabinet',
      'Protection-Token': 'Protection-Token-Value'
    },
    body: JSON.stringify(payload)
  }).then(resp => resp.json());

  return offers;
};

const getPendingProducts = async () => {
  const products = await getKaspiProducts(
    'https://kaspi.kz/merchantcabinet/api/offer/pending/wotrash',
    {
      searchTerm: null,
      approvalStatus: null,
      start: 0,
      count: 4500
    }
  );

  const sku = products.map(p => p.sku);
  console.log(JSON.stringify(sku));
};

// const getPendingProducts = async (start = 0, count = 5) => {
//   const url = 'https://kaspi.kz/merchantcabinet/api/offer/pending/wotrash';
//   const { offers } = await fetch(url, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json; charset=UTF-8',
//       'X-GWT-Module-Base': '/merchantcabinet',
//       'Protection-Token': 'Protection-Token-Value'
//     },
//     body: JSON.stringify({
//       searchTerm: null,
//       approvalStatus: null,
//       start,
//       count
//     })
//   }).then(resp => resp.json());
//
//   const sku = offers.map(offer => offer.sku);
//   console.log(JSON.stringify(sku));
// };

const createDisplayId = id => {
  // eslint-disable-next-line no-param-reassign
  id = id.replace('s', '');
  return `${id.slice(0, 3)}.${id.slice(3, 6)}.${id.slice(6)}`;
};

const getRecommendation = async id => {
  const url = 'https://kaspi.kz/merchantcabinet/api/product/search/sku';
  const { products } = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'X-GWT-Module-Base': '/merchantcabinet',
      'Protection-Token': 'Protection-Token-Value'
    },
    body: JSON.stringify({
      query: id,
      categoryFilter: null,
      categoryCode: null
    })
  })
    .then(resp => resp.json())
    .catch(err => {
      console.error(err);
      return [];
    });

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // console.log('Name', product.name);
    // console.log(
    //   'ID',
    //   `${id} | ${id.replace('s', '')} | ${createDisplayId(id)}`
    // );
    // console.log('============================================');

    if (
      product.name.includes(id) ||
      product.name.includes(id.replace('s', '')) ||
      product.name.includes(createDisplayId(id))
    ) {
      return id;
    }
  }

  return null;
};

// eslint-disable-next-line no-unused-vars
const checker = async (ids, acc = []) => {
  if (ids.length === 0) {
    return JSON.stringify(acc);
  }

  const result = await getRecommendation(ids.splice(0, 1)[0]);

  // eslint-disable-next-line no-underscore-dangle,no-unused-expressions
  result && acc.push(result);

  // eslint-disable-next-line no-return-await
  return await checker(ids, acc);
};
