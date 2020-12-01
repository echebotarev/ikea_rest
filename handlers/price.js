const KZT = 6;
const percent = 35;

const getPrice = (num) => {
  if (typeof num === 'string') {
    // eslint-disable-next-line no-param-reassign
    num = parseInt(num.replace(/ /g, ''), 10);
  }

  // eslint-disable-next-line no-param-reassign
  num *= KZT;

  return Math.ceil(num + (num * percent) / 100);
};

module.exports = getPrice;
