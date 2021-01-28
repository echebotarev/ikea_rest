module.exports = (data) => {
  let products = [];
  try {
    products = data.searchResultPage.products.main.items;
  }
  catch (e) {
    return data.searchResultPage.universalWindow || products;
  }

  return products;
};
