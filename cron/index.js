const cron = require('node-cron');

cron.schedule('30 0 * * *', () => {
  // eslint-disable-next-line global-require
  require('./../handlers/createYmlCatalog');
});
