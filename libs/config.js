const nconf = require('nconf');

nconf.argv().env();

if (process.env.ENV_IN === 'docker') {
  nconf.file('docker', {
    file: `${process.cwd()}/docker.config.json`
  });
}

nconf.file('defaults', {
  file: `${process.cwd()}/config.json`
});

nconf.set('root_path', process.cwd());
nconf.set('public_path', `${process.cwd()}/public`);

module.exports = nconf;
