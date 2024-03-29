const dayjs = require('dayjs');

const { currencyCoefficient, percent, lowPercent } = require('./../constant');

const mongooseClient = require('./../libs/db');

const getPrice = (num, shopId = '001', isLow) => {
  if (typeof num === 'string') {
    // eslint-disable-next-line no-param-reassign
    num = parseInt(num.replace(/ /g, ''), 10);
  }

  // eslint-disable-next-line no-param-reassign
  num = shopId === '002' ? num : num * currencyCoefficient;

  const percentValue =
    isLow && lowPercent[shopId] ? lowPercent[shopId] : percent[shopId];
  return Math.ceil(num + (num * percentValue) / 100);
};

const getMinCompetitorPrice = (prices, shopId) => {
  let minPrice = 100000000;
  prices.forEach((price) => {
    // проверка на устаревание данных
    if (
      price.updatedAt &&
      (
        dayjs(price.updatedAt).isSame(dayjs(), 'day') ||
        dayjs(price.updatedAt).isSame(dayjs().subtract(1, 'day'), 'day')
      )
    ) {
      if (
        // рассматриваем только цены в этом городе
        price.shopId === shopId &&
        // не сравниваем со своей же ценой
        price.merchantId !== shopId &&
        minPrice > price.price
      ) {
        minPrice = price.price;
      }
    }
  });
  return minPrice !== 100000000 ? minPrice : null;
};

const getLowerPrice = async (product, shopId) => {
  // берем обычную цену
  let price = getPrice(
    product.price.price.mainPriceProps.price.integer,
    shopId
  );

  // самая низкая цена, которую мы можем предложить
  const lowPrice = getPrice(
    product.price.price.mainPriceProps.price.integer,
    shopId,
    true
  );

  // берем все цены полученные с Kaspi Shop
  const productPrices = await mongooseClient.ProductPrice.get(
    product.identifier
  );

  // вычисляем самую низкую цену среди конкурентов
  const minCompetitorPrice =
    productPrices && getMinCompetitorPrice(productPrices.prices, shopId);

  // если цена конкурентов ниже нашей
  // если конкурентов нет, то оставляем нашу цену
  if (minCompetitorPrice && minCompetitorPrice < price) {
    // если самая низкая цена, которую мы можем предложить ниже цены конкурентов,
    // то берем самую низкую цену конкурентов и вычитаем 10 тенге
    // если выше, то устанавливаем самую низкую цену, которую мы можем предложить
    price = lowPrice < minCompetitorPrice ? minCompetitorPrice - 10 : lowPrice;
  }

  return price;
};

module.exports = { getPrice, getLowerPrice };
