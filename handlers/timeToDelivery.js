const dayjs = require('dayjs');
require('dayjs/locale/ru');

dayjs.locale('ru');

function getDeliveryDay(startDay) {
  const START_DAY = '2020-12-21T00:00:00+05';
  const deliveryDay = startDay ? startDay.add(7, 'day') : dayjs(START_DAY);
  const nowDay = dayjs();

  // на период новогодних праздников
  return '17 января';
  //
  // if (deliveryDay.diff(nowDay, 'day') > 7) {
  //   return deliveryDay.format('DD MMMM');
  // }
  //
  // return getDeliveryDay(deliveryDay);
}

module.exports = getDeliveryDay;
