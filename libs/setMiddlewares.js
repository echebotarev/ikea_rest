const fs = require('fs');

module.exports = (app, path) => {
  const middlewares = fs.readdirSync(path).sort();
  middlewares.forEach(middleware => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    app.use(require(`${path}/${middleware}`));
  });
};
