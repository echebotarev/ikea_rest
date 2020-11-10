const dayjs = require('dayjs');
require('dayjs/locale/ru');

dayjs.locale('ru');


function getDeliveryDay(startDay) {
  const START_DAY = '2020-11-14T00:00:00+05';
  const deliveryDay = startDay ? startDay.add(7, 'day') : dayjs(START_DAY);
  const nowDay = dayjs();

  if (deliveryDay.diff(nowDay, 'day') > 7) {
    return deliveryDay.format('DD MMMM');
  }

  return getDeliveryDay(deliveryDay);
}

module.exports = getDeliveryDay;
