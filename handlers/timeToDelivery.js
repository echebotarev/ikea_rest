const dayjs = require('dayjs');
require('dayjs/locale/ru');

const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ru');

const data = require('./../constant').timeToDeliveryData;

const getDay = (input, days) => {
  const day = input.format('d');
  if (days.includes(Number(day))) {
    return input;
  }

  return getDay(input.add(1, 'day'), days);
};

const getDeliveryDay = shopId => {
  const nowDay = dayjs().tz(data.timezone[shopId]);

  // среда-суббота
  let lastOrderDay = getDay(nowDay, data.lastOrderDay[shopId]);

  // если день тот же самый, то проверяем сколько времени осталось до конца
  if (lastOrderDay.isSame(nowDay)) {
    const timeToLastTimeToOrder = nowDay.diff(
      `${lastOrderDay.format('YYYY-MM-DD')}${
        data.lastTimeToOrder[shopId][lastOrderDay.format('d')]
      }`,
      'h'
    );

    // console.log('timeToLastTimeToOrder: ', timeToLastTimeToOrder);

    if (timeToLastTimeToOrder >= 0) {
      lastOrderDay = getDay(
        lastOrderDay.add(1, 'day'),
        data.lastOrderDay[shopId]
      );
    }
  }

  // преобразовываем в конкретное время
  lastOrderDay = dayjs(
    `${lastOrderDay.format('YYYY-MM-DD')}${
      data.lastTimeToOrder[shopId][lastOrderDay.format('d')]
    }`
  ).tz(data.timezone[shopId]);

  const deliveryDay =
    shopId === '001'
      ? getDay(lastOrderDay.add(2, 'day'), data.deliveryDay[shopId])
      : getDay(lastOrderDay, data.deliveryDay[shopId]);

  return {
    deliveryDay: deliveryDay.format('DD MMMM'),
    lastOrderDay: lastOrderDay.format('DD MMMM'),
    shoppingDayRawData: getDay(lastOrderDay, data.shoppingDay[shopId]).format(),
    deliveryDayRawData: deliveryDay.format(),
    lastOrderDayRawData: lastOrderDay.format(),
    daysToDelivery: deliveryDay.add(1, 'day').diff(nowDay, 'day')
  };
};

module.exports = getDeliveryDay;
