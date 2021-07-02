/**
 * Функция рассчитывает доступность товара на момент закупки в магазине,
 * если закупка позже чем есть прогноз, возвращает последнее значение прогноза
 * */

const dayjs = require('dayjs');

const getDeliveryDay = require('./../handlers/timeToDelivery');

const getValueOnShoppingDay = forecast => {
  const delivery = getDeliveryDay('001');
  const value = forecast.filter(day =>
    dayjs(delivery.shoppingDayRawData).isSame(day.ValidDateTime['@'], 'day')
  )[0];

  // return value ? parseInt(value.AvailableStock['@'], 10) : null;
  return value ? value.InStockProbabilityCode['@'] === 'HIGH' ? 100 : 0 : null;
};

const getLastValueFromForecast = forecast => {
  const value = forecast[forecast.length - 1];
  // return parseInt(value.AvailableStock['@'], 10);
  return value.InStockProbabilityCode['@'] === 'HIGH' ? 100 : 0;
};

module.exports = available => {
  // так как у IKEA проблемы с прогнозом поставок, но вроде все в порядке с
  // прогнозом продаж, я считаю, что если товара нет сейчас, то он не появится и
  // на момент закупки, чтобы не ошибится.
  try {
    if (
      !available.StockAvailability ||
      !available.StockAvailability.RetailItemAvailability ||
      parseInt(!available.StockAvailability.RetailItemAvailability.AvailableStock['@'], 10)
    ) {
      return 0;
    }
  }
  catch (e) {
    console.log('Error: calculate available', e);
    return 0;
  }

  if (
    !available.StockAvailability ||
    !available.StockAvailability.AvailableStockForecastList ||
    !available.StockAvailability.AvailableStockForecastList
      .AvailableStockForecast
  ) {
    return 0;
  }

  const valueOnShoppingDay = getValueOnShoppingDay(
    available.StockAvailability.AvailableStockForecastList
      .AvailableStockForecast
  );

  return (
    valueOnShoppingDay ||
    getLastValueFromForecast(
      available.StockAvailability.AvailableStockForecastList
        .AvailableStockForecast
    )
  );
};
