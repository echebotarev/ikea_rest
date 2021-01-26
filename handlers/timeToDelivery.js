const dayjs = require('dayjs');
require('dayjs/locale/ru');

dayjs.locale('ru');

function getDeliveryDay(startDay) {
  // в 00:00 субботы начнет показываться время следующей недели.
  const START_DAY = '2021-01-24T17:00:00+05';
  const deliveryDay = startDay ? startDay.add(7, 'day') : dayjs(START_DAY);
  const nowDay = dayjs();

  if (deliveryDay.diff(nowDay, 'day') > 7) {
    return {
      deliveryDay: deliveryDay.format('DD MMMM'),
      lastOrderDay: deliveryDay.subtract(8, 'day').format('DD MMMM')
    };
  }

  return getDeliveryDay(deliveryDay);
}

module.exports = getDeliveryDay;
