const dayjs = require('dayjs');
require('dayjs/locale/ru');

dayjs.locale('ru');

function getDeliveryDay(startDay) {
  // в 14:00 воскресенья начнет показываться время следующей недели.
  const START_DAY = '2021-01-24T14:00:00+05';
  const deliveryDay = startDay ? startDay.add(7, 'day') : dayjs(START_DAY);
  const nowDay = dayjs();

  if (deliveryDay.diff(nowDay, 'day') >= 7) {
    return {
      deliveryDay: deliveryDay.format('DD MMMM'),
      lastOrderDay: deliveryDay.subtract(7, 'day').format('DD MMMM')
    };
  }

  return getDeliveryDay(deliveryDay);
}

module.exports = getDeliveryDay;
