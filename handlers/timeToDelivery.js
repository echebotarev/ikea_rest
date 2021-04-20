const dayjs = require('dayjs');
require('dayjs/locale/ru');

dayjs.locale('ru');

const getDeliveryDay = {
  '001': startDay => {
    // в 00:00 субботы начнет показываться время следующей недели.
    const START_DAY = '2021-04-18T17:00:00+05';
    const deliveryDay = startDay ? startDay.add(7, 'day') : dayjs(START_DAY);
    const nowDay = dayjs();

    if (deliveryDay.diff(nowDay, 'day') > 7) {
      const lastOrderDay = deliveryDay.subtract(8, 'day');
      return {
        deliveryDay: deliveryDay.format('DD MMMM'),
        lastOrderDay: lastOrderDay.format('DD MMMM'),
        lastOrderDayRawData: lastOrderDay.format()
      };
    }

    return getDeliveryDay['001'](deliveryDay);
  },

  '002': () => {
    const nowDay = dayjs();
    const getDay = (input, days) => {
      const day = input.format('d');
      if (days.includes(Number(day))) {
        return input;
      }

      return getDay(input.add(1, 'day'), days);
    };
    const lastTimeToOrder = {
      3: 'T19:00:00+05',
      6: 'T15:00:00+05'
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

    return {
      // вторник-пятница
      deliveryDay: getDay(lastOrderDay, [2, 5]).format('DD MMMM'),
      lastOrderDay: lastOrderDay.format('DD MMMM'),
      lastOrderDayRawData: lastOrderDay.format()
    };
  }
};

module.exports = getDeliveryDay;
