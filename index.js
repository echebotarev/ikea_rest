const express = require('express');
const cors = require('cors');

const config = require('./libs/config');

/** ROUTES * */
const rest = require('./routes/rest');
/** ROUTES * */

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.get('/', (req, res) => res.end('Ok'));
app.use('/api/v1', cors(corsOptions), rest);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
