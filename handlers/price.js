const { currencyCoefficient, percent } = require('./../constant');

const getPrice = (num, shopId = '001') => {
  if (typeof num === 'string') {
    // eslint-disable-next-line no-param-reassign
    num = parseInt(num.replace(/ /g, ''), 10);
  }

  // eslint-disable-next-line no-param-reassign
  num *= currencyCoefficient;

  return Math.ceil(num + (num * percent[shopId]) / 100);
};

module.exports = getPrice;
