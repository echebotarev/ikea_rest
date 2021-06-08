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
  return value ? value.InStockProbabilityCode['@'] === 'HIGH' && 100 : null;
};

const getLastValueFromForecast = forecast => {
  const value = forecast[forecast.length - 1];
  // return parseInt(value.AvailableStock['@'], 10);
  return value.InStockProbabilityCode['@'] === 'HIGH' ? 100 : 0;
};

module.exports = available => {
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
