const nconf = require('nconf');

nconf.argv().env();

nconf.file('defaults', {
  file: `${__dirname}/../config.json`
});

nconf.set('root_path', `${__dirname}/..`);
nconf.set('public_path', `${__dirname}/../public`);

module.exports = nconf;
