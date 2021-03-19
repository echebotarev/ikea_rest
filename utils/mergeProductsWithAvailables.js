module.exports = (products, availables) => {
  return products.map(product => {
    const available = availables.find(a => a.id === product.identifier);
    return available && available.StockAvailability.RetailItemAvailability
      ? Object.assign(product, {
          available:
            available.StockAvailability.RetailItemAvailability.AvailableStock[
              '@'
            ]
        })
      : product;
  });
};
