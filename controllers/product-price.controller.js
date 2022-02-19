const ProductModel = require('./../model/productPrice');

const Product = {
  async get(id) {
    if (Array.isArray(id)) {
      return ProductModel.find({ sku: { $in: id } });
    }

    return ProductModel.findOne({ sku: id });
  }
};

module.exports = Product;
