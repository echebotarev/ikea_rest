module.exports = (products, availables) => {
  return products.map(product => {
    const available = availables.find(a => a && a.id === product.identifier);
    return available &&
      available.StockAvailability &&
      available.StockAvailability.RetailItemAvailability
      ? Object.assign(product, {
          available:
            available.StockAvailability.RetailItemAvailability
              .InStockProbabilityCode['@'] === 'LOW'
              ? 0
              : parseInt(
                  available.StockAvailability.RetailItemAvailability
                    .AvailableStock['@']
                )
        })
      : product;
  });
};
