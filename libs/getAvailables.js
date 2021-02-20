const getAvailableProduct = require('./getAvailableProduct');

module.exports = async products => {
  let availables = products.map(product =>
    isNaN(product.available)
      ? getAvailableProduct({
          id: product.identifier,
          type: product.utag.product_type
        })
      : Promise.resolve(null)
  );

  availables = await Promise.allSettled(availables).then(results =>
    results.map(result =>
      result.status === 'rejected'
        ? console.error(`GetAvailables err: ${result.reason}`) && null
        : result.value
    )
  );

  return availables;
};
