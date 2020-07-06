const express = require('express');

const config = require('./libs/config');

/** ROUTES * */
const rest = require('./routes/rest');
/** ROUTES * */

const app = express();

app.get('/', (req, res) => res.end('Ok'));
app.use('/api/v1', rest);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
