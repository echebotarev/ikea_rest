const dayjs = require('dayjs');
require('dayjs/locale/ru');

const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ru');

const getDeliveryDay = {
  '001': startDay => {
    // в 00:00 субботы начнет показываться время следующей недели.
    const START_DAY = '2021-04-18T17:00:00+05';
    const deliveryDay = startDay
      ? startDay.add(7, 'day')
      : dayjs(START_DAY).tz('Asia/Aqtau');
    const nowDay = dayjs();

    if (deliveryDay.diff(nowDay, 'day') > 7) {
      let lastOrderDay = deliveryDay.subtract(8, 'day');
      lastOrderDay = dayjs(
        `${lastOrderDay.format('YYYY-MM-DD')} 12:00`
      ).tz('Asia/Aqtau');

      return {
        deliveryDay: deliveryDay.format('DD MMMM'),
        lastOrderDay: lastOrderDay.format('DD MMMM'),
        shoppingDayRawData: lastOrderDay.add(1, 'day').format(),
        deliveryDayRawData: deliveryDay.format(),
        lastOrderDayRawData: lastOrderDay.format()
      };
    }

    return getDeliveryDay['001'](deliveryDay);
  },

  '002': () => {
    const nowDay = dayjs().tz('Europe/Moscow');
    const getDay = (input, days) => {
      const day = input.format('d');
      if (days.includes(Number(day))) {
        return input;
      }

      return getDay(input.add(1, 'day'), days);
    };
    const lastTimeToOrder = {
      3: 'T16:00:00+03',
      6: 'T12:00:00+03'
    };

    // среда-суббота
    let lastOrderDay = getDay(nowDay, [3, 6]);

    // если день тот же самый, то проверяем сколько времени осталось до конца
    if (lastOrderDay.isSame(nowDay)) {
      const timeToLastTimeToOrder = nowDay.diff(
        `${lastOrderDay.format('YYYY-MM-DD')}${
          lastTimeToOrder[lastOrderDay.format('d')]
        }`,
        'h'
      );

      console.log('timeToLastTimeToOrder: ', timeToLastTimeToOrder);

      if (timeToLastTimeToOrder >= 0) {
        lastOrderDay = getDay(lastOrderDay.add(1, 'day'), [3, 6]);
      }
    }

    // преобразовываем в конкретное время
    lastOrderDay = dayjs(
      `${lastOrderDay.format('YYYY-MM-DD')}${
        lastTimeToOrder[lastOrderDay.format('d')]
      }`
    ).tz('Europe/Moscow');

    // вторник-пятница
    const deliveryDay = getDay(lastOrderDay, [2, 5]);

    return {
      deliveryDay: deliveryDay.format('DD MMMM'),
      lastOrderDay: lastOrderDay.format('DD MMMM'),
      shoppingDayRawData: getDay(lastOrderDay, [1, 4]).format(),
      deliveryDayRawData: deliveryDay.format(),
      lastOrderDayRawData: lastOrderDay.format()
    };
  }
};

module.exports = getDeliveryDay;
