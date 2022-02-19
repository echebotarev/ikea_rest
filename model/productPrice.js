const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductPrice = new Schema({
  sku: {
    type: String,
    default: ''
  },
  priceMin: {
    type: Number,
    default: 0
  },
  priceMax: {
    type: Number,
    default: 0
  },
  kaspiProductUrl: {
    type: String,
    default: ''
  },
  prices: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// eslint-disable-next-line no-underscore-dangle,func-names
ProductPrice.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id;
});

ProductPrice.set('toJSON', {
  getters: true,
  virtuals: false,
  versionKey: false
});

module.exports = mongoose.model('Product', ProductPrice);
