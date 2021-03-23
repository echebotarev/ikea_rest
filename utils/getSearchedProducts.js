module.exports = (data) => {
  let products = [];
  console.log('Data', data);

  try {
    products = data.searchResultPage.products.main.items;
  }
  catch (e) {
    return data.searchResultPage.universalWindow || products;
  }

  return products;
};
