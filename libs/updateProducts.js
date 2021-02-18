const Client = require('./mongoClient');

module.exports = async (availables) => {
  let updatedProducts = availables
    .filter(available => available && available.StockAvailability.RetailItemAvailability)
    .map(available =>
      Client.findAndUpdate(
        { identifier: available.id },
        {
          $set: {
            available: parseInt(
              available.StockAvailability.RetailItemAvailability.AvailableStock
                .$
            )
          }
        }
      )
    );
  updatedProducts = await Promise.allSettled(updatedProducts).then(results =>
    results.map(result =>
      result.status === 'rejected'
        ? console.error(result.reason) && null
        : result.value
    )
  );

  return updatedProducts;
};
